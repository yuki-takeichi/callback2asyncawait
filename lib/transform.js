const assert = require('assert');

Object.defineProperty(
    Array.prototype,
    "last",
    { get: function() { return this[this.length - 1]; } });

// test

const isBackboneJsStyleFunctionCall = node => {
  if (node.type !== 'CallExpression') {
    return false;
  }

  if(!node.arguments.last) {
    return false;
  };

  return isCallbackObject(node.arguments.last);
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
  isStringLiteral(name)(node.ley);

const isStringLiteral = name => node =>
  node.type === 'Identifier' && key.name === name;

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
  // XXX successContの中身を見て一番外側のcallbackを呼んでいれば、
  //     それを末尾のreturnに変換する。
  const awaitExpression = transformContToAwaitAndDecl(successCont);
  const errorCont = getErrorContinuation(node);
  const catchClause = transformContToCatchClause(errorCont);

  return buildTryCatchClause([awaitExpression], catchClause);
};

// TODO
const transformContToAwaitAndDecl = node => {
  const isSuccessCallbackCall = node =>
    node.type === 'CallExpression'
      && node.callee.type === 'MemberExpression'
      // XXX parameterize `callback`
      && isStringLiteral('callback')(node.object);

  const successCallbackArgument = node =>
    node.block.filter(isSuccessCallbackCall)[0].arguments[0];

  const transformSuccessCallbackCallToReturn = node => {
    const arg = successCallbackArgument(node);
    return {
      type: 'ReturnStatement',
      argument: arg,
    };
  };

  for (let i = 0; i < node.body.length; i++) {
    if (isSuccessCallbackCall(node.body[i])) {
      let next = node.body[i + 1];
      if (next !== undefined) {
        // callback.success(hoge); 以降にコードがある場合はabort
        // TODO: 順序を入れ替えても良いかもしれない
        console.error("Don't do anything after callback call.");
        process.exit(-1);
      }
      node.body[i] = transformSuccessCallbackCallToReturn(node);
    }
  });

  return {
    // XXX use argument name as variable name
    type: 'VariableDeclaration',
    // XXX fix wrong structure
    value: [awaitExpression] + node.body,
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

// Recursively traverse

// XXX handle control flow
const translateCallbackToAsyncAwaitRecursively = node => {

  const newBlock = [];
  const inner = (node, accumlatedBlock) => {
    assert(node.type === 'FunctionExpression');
    assert(isBackboneJsStyleFunctionCall(node.block.last));
  };

  return inner(node, newBlock);
};

module.exports = { isBackboneJsStyleFunctionCall /* , translateBackboneJsStyleFunctionCallToAwaitAndAssign */ };
