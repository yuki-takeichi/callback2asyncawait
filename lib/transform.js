const assert = require('assert');

// test

const isBackboneJsStyleFunctionCall = node => {
  if (node.type !== 'CallExpression') {
    return false;
  }

  const lastArgument = node.arguments.slice(-1)[0];
  if (!lastArgument) {
    return false;
  }

  return isCallbackObject(lastArgument);
}

const isCallbackObject = node => {
  if (node.type !== 'ObjectExpression') {
    return false;
  }

  const successCont = getSuccessContinuation(node);
  const errorCont = getErrorContinuation(node);
  return successCont !== undefined && errorCont !== undefined;
}

const isLiteralKeyProp = name => node =>
    node.key.type === 'Identifier' && node.key.name === name;

const getSuccessContinuation = node => {
  assert(node.type === 'ObjectExpression');
  const prop = node.properties.filter(prop => isLiteralKeyProp('success')(prop))[0];
  if (!prop) { return; }
  if (prop.value.type !== 'FunctionExpression') { return; }
  return prop.value;
};

const getErrorContinuation = node => {
  assert(node.type === 'ObjectExpression');
  const prop = node.properties.filter(prop => isLiteralKeyProp('error')(prop))[0];
  if (!prop) { return; }
  if (prop.value.type !== 'FunctionExpression') { return; }
  return prop.value;
};

// translate

const translateBackboneJsStyleFunctionCallToAwaitAndAssign = node => {
  assert(isBackboneJsStyleFunctionCall(node));

  const successCont = getSuccessContinuation(node);
  const awaitExpression = transformContToAwait(successCont);
  const errorCont = getErrorContinuation(node);
  const catchClause = transformContToCatchClause(errorCont);

  return buildTryCatchClause([{
    // XXX
    type: 'VariableDeclaration',
    value: awaitExpression,
  }], catchClause);
};

// XXX
const transformContToAwait = node => {
  return {
    type: 'AwaitExpression',
  };
};

// XXX
const transformContToCatchClause = node => {
  return {
    type: 'CatchClause',
    body: node.body,
  }
};

// XXX
const buildTryCatchClause = (tryBlock, catchClause) => {
  return {
    type: 'TryStatement',
    block: tryBlock,
    handler: catchClause,
  }
};

module.exports = { isBackboneJsStyleFunctionCall /* , translateBackboneJsStyleFunctionCallToAwaitAndAssign */ };
