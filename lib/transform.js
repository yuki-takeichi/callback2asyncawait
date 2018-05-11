const assert = require('assert');

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
    node.key.type === 'Identifier' && node.key.name === 'success';

const getSuccessContinuation = node => {
  assert(node.type === 'ObjectExpression');
  const prop = node.properties.filter(prop => isLiteralKeyProp('success')(prop))[0];
  if (!prop) { return; }
  return prop.value;
};

const getErrorContinuation = node => {
  assert(node.type === 'ObjectExpression');
  const prop = node.properties.filter(prop => isLiteralKeyProp('error')(prop))[0];
  if (!prop) { return; }
  return prop.value;
};

module.exports = { isBackboneJsStyleFunctionCall };

/*
 [ ObjectExpression {
     type: 'ObjectExpression',
     properties: 
      [ Property {
          type: 'Property',
          key: Identifier { type: 'Identifier', name: 'success' },
          computed: false,
          value: 
           FunctionExpression {
*/
