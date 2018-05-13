var module = require('./module');

async function control() {
  if (module.predicate) {
    return await module.funcA1();
  } else {
    return await module.funcA2();
  }
};

async function main() {
  try {
    var result = await control();
    console.log(result);
  } catch(e) {
    console.error(e);
  }
}

main();
