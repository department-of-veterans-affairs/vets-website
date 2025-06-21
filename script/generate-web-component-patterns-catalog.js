/* eslint-disable no-shadow */
/* eslint-disable no-console */

/**
 * Script to generate a catalog of all web component patterns
 * by using AST to check the exports and jsdocs for all files in the
 * web-component-patterns directory
 *
 * Output: src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.json
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const patternsDir = path.join(
  __dirname,
  '../src/platform/forms-system/src/js/web-component-patterns',
);
const catalogPath = path.join(
  patternsDir,
  'web-component-patterns-catalog.json',
);

const files = fs
  .readdirSync(patternsDir)
  .filter(
    file =>
      file !== 'web-component-patterns-catalog.json' &&
      file !== 'index.js' &&
      (file.endsWith('.js') || file.endsWith('.jsx')),
  );

const extractDescriptionFromJSDocs = comments => {
  if (comments && comments.length > 0) {
    const jsdoc = comments[comments.length - 1].value.trim();
    const lines = jsdoc
      .split('\n')
      .map(line => line.replace(/^\s*\*\s*/, '').trim());
    const contentLines = lines.filter(line => line && !line.startsWith('@'));
    const firstLine = contentLines.length > 0 ? contentLines[0] : '';
    return firstLine || null;
  }
  return null;
};

const getCategoryFromFilename = filename => {
  return filename
    .replace(/patterns?\.jsx?$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(
      /\b\w/g,
      (char, index) => (index === 0 ? char.toUpperCase() : char.toLowerCase()),
    )
    .trim();
};

const getPatternBaseName = name => {
  return name.replace(/(UI|Schema)$/, '');
};

const getPatternTypeFromName = name => {
  if (name.endsWith('UI')) {
    return 'uiSchema';
  }
  if (name.endsWith('Schema')) {
    return 'schema';
  }
  return 'unknown';
};

const getJavaScriptType = (declaration, init) => {
  if (declaration?.type === 'FunctionDeclaration') {
    return 'function';
  }
  if (init?.type === 'ArrowFunctionExpression') {
    return 'function';
  }
  if (declaration?.type === 'ClassDeclaration') {
    return 'class';
  }
  return 'object';
};

const processDeclarationExport = (declaration, exportComments) => {
  const description = extractDescriptionFromJSDocs(
    exportComments || declaration.leadingComments,
  );
  const patternType = getPatternTypeFromName(declaration.id.name);
  const jsType = getJavaScriptType(declaration);
  return {
    name: declaration.id.name,
    patternType,
    jsType,
    description,
  };
};

// TODO
// const getExamplesPath = (baseName, category) => {
//   return 'TODO';
// };

const allPatterns = new Map();

files.forEach(file => {
  const filePath = path.join(patternsDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const category = getCategoryFromFilename(file);

  try {
    const ast = parser.parse(fileContent, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    const exports = [];

    traverse(ast, {
      ExportNamedDeclaration(path) {
        const { declaration, specifiers } = path.node;
        const exportComments = path.node.leadingComments;

        if (declaration) {
          if (declaration.type === 'FunctionDeclaration') {
            exports.push(processDeclarationExport(declaration, exportComments));
          } else if (declaration.type === 'VariableDeclaration') {
            declaration.declarations.forEach(decl => {
              const description = extractDescriptionFromJSDocs(
                exportComments ||
                  declaration.leadingComments ||
                  path.parent?.leadingComments,
              );
              const patternType = getPatternTypeFromName(decl.id.name);
              const jsType = getJavaScriptType(declaration, decl.init);
              exports.push({
                name: decl.id.name,
                patternType,
                jsType,
                description,
              });
            });
          } else if (declaration.type === 'ClassDeclaration') {
            exports.push(processDeclarationExport(declaration, exportComments));
          }
        } else if (specifiers && specifiers.length > 0) {
          specifiers.forEach(specifier => {
            const exportedName = specifier.exported.name;
            const localName = specifier.local.name;
            const binding = path.scope.getBinding(localName);

            if (binding) {
              let description = null;

              if (exportComments) {
                description = extractDescriptionFromJSDocs(exportComments);
              } else if (binding.path.node.leadingComments) {
                description = extractDescriptionFromJSDocs(
                  binding.path.node.leadingComments,
                );
              } else if (
                binding.path.parent &&
                binding.path.parent.leadingComments
              ) {
                description = extractDescriptionFromJSDocs(
                  binding.path.parent.leadingComments,
                );
              }

              const patternType = getPatternTypeFromName(exportedName);
              const bindingNode = binding.path.node;
              let jsType = 'object';

              if (
                bindingNode.type === 'FunctionDeclaration' ||
                (bindingNode.type === 'VariableDeclarator' &&
                  bindingNode.init &&
                  bindingNode.init.type === 'ArrowFunctionExpression')
              ) {
                jsType = 'function';
              } else if (bindingNode.type === 'ClassDeclaration') {
                jsType = 'class';
              }

              exports.push({
                name: exportedName,
                patternType,
                jsType,
                description,
              });
            }
          });
        }
      },
    });

    const filteredExports = exports.filter(exp =>
      exp.name.match(/(UI|Schema)\b/),
    );

    // Store exports with category info
    filteredExports.forEach(exp => {
      const key = `${category}:${exp.name}`;
      allPatterns.set(key, {
        ...exp,
        category,
      });
    });
  } catch (error) {
    console.error(`Error parsing file ${file}:`, error.message);
  }
});

const combinedPatterns = new Map();

allPatterns.forEach(pattern => {
  const baseName = getPatternBaseName(pattern.name);
  const patternKey = `${pattern.category}:${baseName}`;

  if (!combinedPatterns.has(patternKey)) {
    combinedPatterns.set(patternKey, {
      category: pattern.category,
      uiSchema: null,
      uiSchemaType: null,
      uiSchemaDescription: null,
      schema: null,
      schemaType: null,
      schemaDescription: null,
      // examplesPath: null,
    });
  }

  const combined = combinedPatterns.get(patternKey);

  if (pattern.patternType === 'uiSchema') {
    combined.uiSchema = pattern.name;
    combined.uiSchemaType = pattern.jsType;
    combined.uiSchemaDescription = pattern.description;
  } else if (pattern.patternType === 'schema') {
    combined.schema = pattern.name;
    combined.schemaType = pattern.jsType;
    combined.schemaDescription = pattern.description;
  }

  // TODO: Implement examplesPath
  // combined.examplesPath = getExamplesPath(baseName, pattern.category);
});

const catalog = {
  title: 'VA.gov Web Component Form Field Patterns Catalog (RJSF)',
  description:
    'Catalog of all acceptable web component uiSchema and schema patterns for form fields in VA.gov applications. These patterns are used in pairs to define form field behavior and validation in RJSF (React JSON Schema Form) implementations using the VA design system web components.',
  importPath: 'platform/forms-system/src/js/web-component-patterns',
  totalPatterns: combinedPatterns.size,
  patterns: Array.from(combinedPatterns.values()).sort((a, b) => {
    // Sort by category first, then by uiSchema name
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    const aName = a.uiSchema || a.schema || '';
    const bName = b.uiSchema || b.schema || '';
    return aName.localeCompare(bName);
  }),
};

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));

console.log(
  'web-component-patterns-catalog.json has been generated successfully.',
);
console.log(`Total patterns: ${catalog.totalPatterns}`);
