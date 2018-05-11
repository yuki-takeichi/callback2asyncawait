var func = require('./module');

async function main() {

  try {
    var result = /* Cont1 */ await func();
    console.log(result);
  } catch(e) {
    // Cont2
    console.error(e);
  }

}

main();
