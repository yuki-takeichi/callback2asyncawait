const fs = require('fs');
const util = require('util');
const esprima = require('esprima');
const estraverse = require('estraverse');

const path = process.argv[2] || './simple/cpsed.js';
const code = fs.readFileSync(path, 'utf8');
const ast = esprima.parse(code);

const transform = require('./lib/transform');
const inspect = obj => console.log(util.inspect(obj, false, null));

inspect(ast);

return;
estraverse.traverse(ast, {
  enter: (node, parent) => {
    if (transform.isBackboneJsStyleFunctionCall(node)) {
      inspect(node);
    }
  },
  leave: (node, parent) => {},
});
