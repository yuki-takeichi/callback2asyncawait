module.exports = function(callback) {
  if (callback) {
    callback.success('hoge');
    return;
  }

  return 'hoge';
}
