var func = require('./module');

function main() {

  // Cont1
  var success = function(result) {
    console.log(result);
  };

  // Cont2
  var error = function(e) {
    console.error(e);
  };

  // 引数の末尾が {success: (x:T) => Void, error: (e: Error) => Void} な
  // objectが渡されている関数について裏返す
  func({success, error});
}

main();
