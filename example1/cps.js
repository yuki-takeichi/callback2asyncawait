var module = require('./module');

async function example(funcA, funcB, funcC) {
  var x, y, z;
  try {
    x = await funcA();
  } catch (e1) {
    return e1;
  }

  try {
    y = await funcB(x);
  } catch (e2) {
    return e2;
  }

  try {
    z = await funcC(y);
  } catch (e2) {
    return e2;
  }

  return z;
}

async function main() {
  try {
    var result = await example(module.funcA, module.funcB, module.funcC);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

main();
