async function funcA1(callback) {
  if (callback) {
    callback.success('hoge');
    return;
  }
  return 'hoge';
}

async function funcA1Error(callback) {
  if (callback) {
    callback.error('hoge');
    return;
  }
  throw 'hoge';
}

async function funcA2(callback) {
  if (callback) {
    callback.success('foo');
    return;
  }
  return 'foo';
}

async function funcA2Error(callback) {
  if (callback) {
    callback.error('foo');
    return;
  }
  throw 'foo';
}

module.exports = {
  predicate: true,
  funcA1,
  funcA2,
};
