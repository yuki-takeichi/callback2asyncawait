var module = require('./module');

function exampleCPSed(funcA, funcB, funcC, callback) {
  funcA({success: function(x) {
    funcB(x, {success: function(y) {
      funcC(y, {success: function(z) {
        callback.success(z);
      }, error: function(e3) {
        callback.error(e3);
      }});
    }, error: function(e2) {
      callback.error(e2);
    }});
  }, error: function(e1) {
    callback.error(e1);
  }});
}

function main() {
  exampleCPSed(module.funcA, module.funcB, module.funcC, { success: function(result) {
    console.log(result);
  }, error: function(e) {
    console.error(e);
  }});
}

main();
