const MESSAGE =
  'Deprecated Cypress viewport method, please choose a method from https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/testing/end-to-end/cypress-best-practices-on-vsp.md#viewport-presets-cyviewportpresetpreset-orientation-options';

const rule = {
  meta: {
    docs: {
      description: MESSAGE,
      category: 'best practices',
      recommended: true,
    },
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
module.exports = rule;
