module.exports = {
  meta: {
    docs: {
      description: 'Cypress E2E tests must include at least one axeCheck call.',
      category: 'Best Practices',
      recommended: false,
      url: 'https://depo-platform-documentation.scrollhelp.site/developer-docs/A11y-Testing.1935409178.html',
    },
    type: 'suggestion',
    schema: [],
    messages: {
      missingAxeCheckCall:
        'Cypress E2E tests must include at least one axeCheck call. Documentation for adding checks and understanding errors can be found here: https://depo-platform-documentation.scrollhelp.site/developer-docs/A11y-Testing.1935409178.html',
    },
  },

  create(context) {
    let currentItNode = undefined;
    let hasSeenAxeCheckCall = false;
    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'it') {
          // Entering new `it` test.
          currentItNode = node;
          hasSeenAxeCheckCall = false;
        } else if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'cy' &&
          node.callee.property.type === 'Identifier' &&
          (node.callee.property.name === 'axeCheck' ||
            node.callee.property.name === 'injectAxeThenAxeCheck' || 
            node.callee.property.name === 'axeCheckBestPractice')
        ) {
          // Found: cy.axeCheck() or cy.injectAxeThenAxeCheck()
          hasSeenAxeCheckCall = true;
        }
      },

      'CallExpression:exit'(node) {
        if (node === currentItNode) {
          // Leaving `it` test.

          if (!hasSeenAxeCheckCall) {
            context.report({ node, messageId: 'missingAxeCheckCall' });
          }

          currentItNode = undefined;
          hasSeenAxeCheckCall = false;
        }
      },
    };
  },
};
