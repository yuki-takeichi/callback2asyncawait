var module = require('./module');

function control(callback) {
  if (module.predicate) {
    funcA1({success: function(result1) {
      callback.success(result1);
    }, error: function(e) {
      callback.error(e);
    });
  } else {
    funcA2({success: function(result2) {
      callback.success(result2);
    }, error: function(e) {
      callback.error(e);
    });
  }
}

function main() {
  control({success: console.log, error: console.error });
}

main();
