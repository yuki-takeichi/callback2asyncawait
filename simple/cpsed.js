var func = require('./module');

function main() {

  // 引数の末尾が {success: (x:T) => Void, error: (e: Error) => Void} な
  // objectが渡されている関数について裏返す
  func({success: function(result) {
    // Cont1
    console.log(result);
  }, error: function(e) {
    // Cont2
    console.error(e);
  }});
}

main();
