async function funcA(callback) {
  if (callback) {
    callback.success('hoge');
    return;
  }
  return 'hoge';
}

async function funcAError(callback) {
  if (callback) {
    callback.error('hoge');
    return;
  }
  throw 'hoge';
}

async function funcB(x, callback) {
  if (callback) {
    callback.success(x + ':foo');
    return;
  }
  return x + ':foo';
}

async function funcBError(x, callback) {
  if (callback) {
    callback.error('foo');
    return;
  }
  throw 'foo';
}

async function funcC(y, callback) {
  if (callback) {
    callback.success(y + ':bar');
    return;
  }
  return y + ':bar';
}

async function funcCError(y, callback) {
  if (callback) {
    callback.error('bar');
    return;
  }
  throw 'bar';
}

module.exports = { funcA: funcA, funcB: funcB, funcC:funcCError };
