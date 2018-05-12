var func = require('./module');

function simple(callback) {

  // 引数の末尾が {success: (x:T) => Void, error: (e: Error) => Void} な
  // objectが渡されている関数について裏返す
  func({success: function(result) {
    // Cont1
    callback.success(result);
  }, error: function(e) {
    // Cont2
    callback.error(e);
  }});
}

function main() {
  simple({success: console.log, error: console.error });
}

main();
