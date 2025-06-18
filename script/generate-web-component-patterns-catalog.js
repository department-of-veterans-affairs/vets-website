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

    // Helper function to extract description from JSDoc comments
    const extractDescription = comments => {
      if (comments && comments.length > 0) {
        const jsdoc = comments[comments.length - 1].value.trim();

        // Extract the first line of the JSDoc comment and clean it up
        // First, split by newlines and filter out empty lines or lines with only *
        const lines = jsdoc
          .split('\n')
          .map(line => line.replace(/^\s*\*\s*/, '').trim());
        const contentLines = lines.filter(
          line => line && !line.startsWith('@'),
        );

        // Take the first non-empty line as the description
        const firstLine = contentLines.length > 0 ? contentLines[0] : '';
        return firstLine || null;
      }
      return null;
    };

    traverse(ast, {
      ExportNamedDeclaration(path) {
        const { declaration, specifiers } = path.node;

        // Check for comments on the export declaration itself
        const exportComments = path.node.leadingComments;

        if (declaration) {
          if (declaration.type === 'FunctionDeclaration') {
            // For function declarations, check comments directly on the function
            const description = extractDescription(
              exportComments || declaration.leadingComments,
            );
            exports.push({
              name: declaration.id.name,
              type: 'function',
              description,
            });
          } else if (declaration.type === 'VariableDeclaration') {
            declaration.declarations.forEach(decl => {
              const isFunction =
                decl.init && decl.init.type === 'ArrowFunctionExpression';

              // Try to get JSDoc from different possible locations
              const description = extractDescription(
                exportComments ||
                  declaration.leadingComments ||
                  path.parent?.leadingComments,
              );

              exports.push({
                name: decl.id.name,
                type: isFunction ? 'function' : 'object',
                description,
              });
            });
          } else if (declaration.type === 'ClassDeclaration') {
            const description = extractDescription(
              exportComments || declaration.leadingComments,
            );
            exports.push({
              name: declaration.id.name,
              type: 'class',
              description,
            });
          }
        } else if (specifiers && specifiers.length > 0) {
          specifiers.forEach(specifier => {
            const exportedName = specifier.exported.name;
            const localName = specifier.local.name;

            // Check if the local name is a function, class, or variable
            const binding = path.scope.getBinding(localName);
            if (binding) {
              const bindingNode = binding.path.node;
              let type = 'unknown';
              let description = null;

              // Try to find comments in various places
              if (exportComments) {
                description = extractDescription(exportComments);
              } else if (binding.path.node.leadingComments) {
                description = extractDescription(
                  binding.path.node.leadingComments,
                );
              } else if (
                binding.path.parent &&
                binding.path.parent.leadingComments
              ) {
                description = extractDescription(
                  binding.path.parent.leadingComments,
                );
              }

              if (
                bindingNode.type === 'FunctionDeclaration' ||
                (bindingNode.type === 'VariableDeclarator' &&
                  bindingNode.init &&
                  bindingNode.init.type === 'ArrowFunctionExpression')
              ) {
                type = 'function';
              } else if (bindingNode.type === 'ClassDeclaration') {
                type = 'class';
              } else {
                type = 'object';
              }

              exports.push({
                name: exportedName,
                type,
                description,
              });
            } else {
              exports.push({
                name: exportedName,
                type: 'unknown',
                description: null,
              });
            }
          });
        }
      },
      ExportDefaultDeclaration(path) {
        const { declaration } = path.node;
        // Try to get JSDoc from the export or the declaration itself
        const description = extractDescription(
          path.node.leadingComments ||
            (declaration.type === 'Identifier'
              ? null
              : declaration.leadingComments),
        );

        if (declaration.type === 'Identifier') {
          exports.push({
            name: declaration.name,
            type: 'object',
            description,
          });
        } else if (declaration.type === 'FunctionDeclaration') {
          exports.push({
            name: 'default export',
            type: 'function',
            description,
          });
        } else {
          exports.push({
            name: 'default export',
            type: 'object',
            description,
          });
        }
      },
    });

    // Filter exports to only include those ending in 'UI' or 'Schema'
    const filteredExports = exports.filter(exp =>
      exp.name.match(/(UI|Schema)\b/),
    );

    if (filteredExports.length > 0) {
      filteredExports.forEach(({ name, type, description }) => {
        const desc = description ? ` — ${description}` : '';
        readmeContent += `- \`${name}\` (${type})${desc}\n`;
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
