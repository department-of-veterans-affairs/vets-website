const MESSAGE =
  'THIS IS A SUPER AWESOME ERROR MESSAGE ABOUT AXE CHECKS IN E2E TESTS';

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
