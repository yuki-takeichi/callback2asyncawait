var func = require('./module');

async function simple() {

  try {
    return /* Cont1 */ await func();
  } catch(e) {
    // Cont2
    throw e;
  }

}

async function main() {
  try {
    var result = await simple();
    console.log(result);
  } catch(e) {
    console.error(e);
  }
}

main();
