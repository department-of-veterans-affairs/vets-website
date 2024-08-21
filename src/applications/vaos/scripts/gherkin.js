/* eslint-disable no-console */
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const glob = require('glob');

let gwtTests = 0;
let regularTests = 0;

function isTest(path) {
  return (
    path.node.type === 'CallExpression' &&
    (path.node.callee.name === 'it' ||
      (path.node.callee.object?.name === 'it' &&
        path.node.callee.property?.name === 'only'))
  );
}

function isBlock(path) {
  return (
    path.node.type === 'CallExpression' &&
    (path.node.callee.name === 'describe' ||
      (path.node.callee.object?.name === 'describe' &&
        path.node.callee.property?.name === 'only'))
  );
}

function getComments(path) {
  const commentBlocks = path.node.arguments[1].body.body
    .filter(item => item.leadingComments?.length)
    .map(item => item.leadingComments);

  return []
    .concat(...commentBlocks)
    .map(item => item.value.trim())
    .filter(
      item =>
        item.startsWith('Given') ||
        item.startsWith('When') ||
        item.startsWith('Then') ||
        item.startsWith('And'),
    );
}

function parseTestFile(features, code) {
  const stack = [];
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  traverse.default(ast, {
    enter(path) {
      if (isBlock(path)) {
        const parent = stack[stack.length - 1];
        const block = {
          type: !parent ? 'Feature' : 'Background',
          name: path.node.arguments[0].value,
          nodes: [],
        };

        if (parent) {
          parent.nodes.push(block);
        }

        stack.push(block);
      }

      if (isTest(path)) {
        const scenario = {
          type: 'Scenario',
          name: path.node.arguments[0].value,
          parts: [],
        };
        stack[stack.length - 1].nodes.push(scenario);

        scenario.parts = getComments(path);

        if (scenario.parts.length) {
          gwtTests += 1;
          scenario.isGWT = true;
          stack.forEach(i => {
            // eslint-disable-next-line no-param-reassign
            i.isGWT = true;
          });
        } else {
          regularTests += 1;
        }
      }
    },
    exit(path) {
      if (isBlock(path)) {
        const item = stack.pop();
        if (!stack.length) {
          features.push(item);
        }
      }
    },
  });
}

let indents = 0;
function indent() {
  return ''.padStart(2 * indents, ' ');
}

function printTree(node) {
  if (node.type === 'Scenario') {
    console.log(`${indent()}Scenario: ${node.name}`);
    indents += 1;
    node.parts.forEach(part => {
      if (part.startsWith('And')) {
        indents += 1;
      }
      console.log(`${indent()}${part}`);
      if (part.startsWith('And')) {
        indents -= 1;
      }
    });
    console.log();
    indents -= 1;
  } else if (!node.root) {
    console.log(`${indent()}${node.type}: ${node.name}`);
    console.log();
  }

  if (node.nodes) {
    indents += 1;
    node.nodes.filter(n => n.isGWT).forEach(printTree);
    indents -= 1;
  }
}

if (require.main === module) {
  const defaultGlob = './src/applications/vaos/**/*.unit.spec.js*';
  const filesToParse = process.argv.slice(2);

  const fileList =
    filesToParse.length > 1
      ? filesToParse
      : glob.sync(process.argv[2] || defaultGlob);

  const features = [];
  fileList.forEach(f => {
    if (
      !fs.lstatSync(f).isDirectory() &&
      (f.endsWith('.js') || f.endsWith('.jsx'))
    ) {
      parseTestFile(features, fs.readFileSync(f, 'utf8'));
    }
  });
  printTree({ root: true, nodes: features.filter(feature => feature.isGWT) });

  console.log(`${gwtTests} scenarios in GWT format`);
  console.log(`${regularTests} other tests`);
}

module.exports = {
  isTest,
  isBlock,
  getComments,
};
