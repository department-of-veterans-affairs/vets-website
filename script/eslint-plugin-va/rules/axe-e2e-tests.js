const MESSAGE =
  'e2e Tests must include at least one axeCheck call. Source code can be found here: ./src/platform/testing/e2e/nightwatch-commands/axeCheck.js';

const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: MESSAGE,
      category: 'best practices',
      recommended: false,
    },
  },
  create: context => {
    let axeCheckCount = 0;
    return {
      MemberExpression: node => {
        if (node.property.name === 'axeCheck') {
          axeCheckCount++;
        }
      },
      'Program:exit': function(node) {
        if (axeCheckCount === 0) {
          const message = `${MESSAGE}`;
          context.report({
            node,
            message,
          });
        }
      },
    };
  },
};

module.exports = rule;
