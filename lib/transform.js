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
  const awaitExpression = transformContToAwaitAndDecl(successCont);
  const errorCont = getErrorContinuation(node);
  const catchClause = transformContToCatchClause(errorCont);

  return buildTryCatchClause([awaitExpression], catchClause);
};

// TODO
const transformContToAwaitAndDecl = node => {
  return {
    // XXX use argument name as variable name
    type: 'VariableDeclaration',
    // XXX fix wrong structure
    value: {
      type: 'AwaitExpression',
    },
  };
};

// TODO
const transformContToCatchClause = node => {
  // XXX just replacing 'catch' to 'function' might be good enough,
  //     but do it AST-way
  return {
    type: 'CatchClause',
    body: node.body,
  }
};

// TODO
const buildTryCatchClause = (tryBlock, catchClause) => {
  return {
    type: 'TryStatement',
    block: tryBlock,
    handler: catchClause,
  }
};

module.exports = { isBackboneJsStyleFunctionCall /* , translateBackboneJsStyleFunctionCallToAwaitAndAssign */ };
