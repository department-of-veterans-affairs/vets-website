/* eslint-disable va/use-resolved-path */
// self rule is disabled because it contains the string needed for comparison
const MESSAGE = 'Use resolved path and remove unnecessary parent path';

function isIncluded(val, path) {
  const isString = str => typeof str === 'string';
  if (!isString(val) || path === null) {
    return false;
  }
  return val.includes(path);
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
          applicationsPath: {
            description: 'report path containng `applications`',
            type: 'boolean',
          },
          platformPath: {
            description: 'report path containng `platform`',
            type: 'boolean',
          },
          sitePath: {
            description: 'report path containng `site`',
            type: 'boolean',
          },
        },
      },
    ],
  },
  create(context) {
    const _ref = context.options[0] || {};
    const applicationsPath = _ref.applicationsPath ? '../applications/' : null;
    const platformPath = _ref.platformPath ? '../platform/' : null;
    const sitePath = _ref.sitePath ? '../site/' : null;

    return {
      Literal(node) {
        if (
          isIncluded(node.value, applicationsPath) ||
          isIncluded(node.value, platformPath) ||
          isIncluded(node.value, sitePath)
        ) {
          context.report({
            node,
            message: MESSAGE,
          });
        }
      },
    };
  },
};
