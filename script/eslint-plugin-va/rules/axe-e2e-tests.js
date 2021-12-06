const MESSAGE =
  'Cypress E2E tests must include at least one axeCheck call. Documentation for adding checks and understanding errors can be found here: https://depo-platform-documentation.scrollhelp.site/developer-docs/A11y-Testing.1935409178.html';

module.exports = {
  meta: {
    docs: {
      description: 'Cypress E2E tests must include at least one axeCheck call.',
      category: 'Best Practices',
      recommended: false,
    },
    messages: {
      unexpected: 'Cypress E2E tests must include at least one axeCheck call.',
    },
  },

  create(context) {
    return {
      Identifier(node) {
        if (node.name === 'it') {
          const testBody = context.getSourceCode().text;
          if (!testBody.toLowerCase().includes('axecheck')) {
            context.report({ node, message: MESSAGE });
          }
        }
      },
    };
  },
};
