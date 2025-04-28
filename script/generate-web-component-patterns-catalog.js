/* eslint-disable no-shadow */
/* eslint-disable no-console */
// *****************************************************************
// This file generates
// src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.md
// by using AST to read all the files in the web-component-patterns directory
// *****************************************************************
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const patternsDir = path.join(
  __dirname,
  '../src/platform/forms-system/src/js/web-component-patterns',
);
const readmePath = path.join(patternsDir, 'web-component-patterns-catalog.md');

// Get all files in the directory except web-component-patterns-catalog.md and index.js
const files = fs
  .readdirSync(patternsDir)
  .filter(
    file =>
      file !== 'web-component-patterns-catalog.md' &&
      file !== 'index.js' &&
      (file.endsWith('.js') || file.endsWith('.jsx')),
  );

let readmeContent =
  '<!-- This file is auto-generated. Do not edit directly. -->\n';
readmeContent += '# Web component patterns catalog\n\n';
readmeContent += `All patterns are imported from 'platform/forms-system/src/js/web-component-patterns'.\n\n`;

files.forEach(file => {
  const filePath = path.join(patternsDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Format the title to exclude "patterns.js" or "pattern.jsx" and use sentence case
  const formattedTitle = file
    .replace(/patterns?\.jsx?$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(
      /\b\w/g,
      (char, index) => (index === 0 ? char.toUpperCase() : char.toLowerCase()),
    )
    .trim();

  readmeContent += `## ${formattedTitle}\n\n`;

  try {
    const ast = parser.parse(fileContent, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    const exports = [];

    traverse(ast, {
      ExportNamedDeclaration(path) {
        const { declaration, specifiers } = path.node;
        if (declaration) {
          if (declaration.type === 'FunctionDeclaration') {
            exports.push(`${declaration.id.name} (function)`);
          } else if (declaration.type === 'VariableDeclaration') {
            declaration.declarations.forEach(decl => {
              const isFunction =
                decl.init && decl.init.type === 'ArrowFunctionExpression';
              if (isFunction) {
                exports.push(`${decl.id.name} (function)`);
              } else {
                exports.push(`${decl.id.name} (object)`);
              }
            });
          } else if (declaration.type === 'ClassDeclaration') {
            exports.push(`${declaration.id.name} (class)`);
          }
        } else if (specifiers && specifiers.length > 0) {
          specifiers.forEach(specifier => {
            const exportedName = specifier.exported.name;
            const localName = specifier.local.name;

            // Check if the local name is a function, class, or variable
            const binding = path.scope.getBinding(localName);
            if (binding) {
              const bindingNode = binding.path.node;
              if (
                bindingNode.type === 'FunctionDeclaration' ||
                (bindingNode.type === 'VariableDeclarator' &&
                  bindingNode.init &&
                  bindingNode.init.type === 'ArrowFunctionExpression')
              ) {
                exports.push(`${exportedName} (function)`);
              } else if (bindingNode.type === 'ClassDeclaration') {
                exports.push(`${exportedName} (class)`);
              } else {
                exports.push(`${exportedName} (object)`);
              }
            } else {
              exports.push(`${exportedName} (unknown)`);
            }
          });
        }
      },
      ExportDefaultDeclaration(path) {
        const { declaration } = path.node;
        if (declaration.type === 'Identifier') {
          exports.push(`${declaration.name} (object)`);
        } else if (declaration.type === 'FunctionDeclaration') {
          exports.push(`default export (function)`);
        } else {
          exports.push('default export (object)');
        }
      },
    });

    // Filter exports to only include those ending in 'UI' or 'Schema'
    const filteredExports = exports.filter(exp => exp.match(/(UI|Schema)\b/));

    if (filteredExports.length > 0) {
      filteredExports.forEach(exp => {
        readmeContent += `- ${exp}\n`;
      });
    } else {
      readmeContent += '- No matching exports found\n';
    }
  } catch (error) {
    readmeContent += `- Error parsing file: ${error.message}\n`;
  }

  readmeContent += '\n';
});

fs.writeFileSync(readmePath, readmeContent);

console.log(
  'web-component-patterns-catalog.md has been generated successfully.',
);
