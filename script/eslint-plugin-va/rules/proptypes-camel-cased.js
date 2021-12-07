const MESSAGE =
  'The PropTypes library is capitalized, but the class property needs to be camel cased';
module.exports = {
  meta: {
    type: 'problem',
    // eslint-disable-next-line eslint-plugin/require-meta-docs-url -- no documentation yet
    docs: {
      description: MESSAGE,
      category: 'best practices',
      recommended: true,
    },
    schema: [],
  },
  create: (context) => ({
    MemberExpression: (node) => {
      if (node.property.name === 'PropTypes') {
        context.report({
          node,
          message: MESSAGE,
        });
      }
    },
  }),
};
