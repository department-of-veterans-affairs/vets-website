const MESSAGE = 'Do not use relative path. ';
const DEFAULTS = ['applications'];
let ALIASPATH = 'Instead, use absolute path for ';

function isIncluded(val, aliases) {
  const isString = str => typeof str === 'string';
  let alias;

  if (!isString(val) || aliases === null) {
    return false;
  }

  for (alias of aliases) {
    const path = `../${alias}/`;
    if (val.includes(path)) {
      ALIASPATH += alias;
      return true;
    }
  }
  return false;
}

module.exports = {
  meta: {
    docs: {
      description: MESSAGE,
      category: 'best practices',
      recommended: true,
    },
    schema: [
      {
        properties: {
          aliases: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
  },
  create(context) {
    const configuration = context.options[0] || {};
    const aliases = configuration.aliases || DEFAULTS;

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        if (isIncluded(value, aliases)) {
          context.report({
            node,
            message: MESSAGE + ALIASPATH,
          });
        }
      },
      CallExpression(node) {
        const callee = node.callee.name || node.callee.type;
        if (callee === 'Import') {
          const value = node.arguments[0].value;
          if (isIncluded(value, aliases)) {
            context.report({
              node,
              message: MESSAGE + ALIASPATH,
            });
          }
        }
      },
    };
  },
};
