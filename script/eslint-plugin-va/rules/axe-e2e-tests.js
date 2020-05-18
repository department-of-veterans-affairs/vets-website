const MESSAGE =
  'e2e tests must include at least one axeCheck call. Documentation for adding checks and understanding errors can be found here: https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/engineering/frontend/eslint/axe-check-required.md';

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

    const checkAxeCountForReport = node => {
      if (axeCheckCount === 0) {
        const message = `${MESSAGE}`;
        context.report({
          node,
          message,
        });
      }
    };

    return {
      MemberExpression: node => {
        if (node.property.name === 'axeCheck') {
          axeCheckCount++;
        }
      },
      'Program:exit': checkAxeCountForReport,
    };
  },
};

module.exports = rule;
