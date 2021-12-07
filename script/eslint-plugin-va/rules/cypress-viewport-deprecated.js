const MESSAGE =
  'Deprecated Cypress viewport method, please choose a method from https://depo-platform-documentation.scrollhelp.site/developer-docs/Viewport-Testing.1934295213.html';

module.exports = {
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-docs-url -- no documentation yet
    docs: {
      description: MESSAGE,
      category: 'best practices',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object.name === 'cy' &&
          node.property.loc.identifierName === 'viewport'
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
