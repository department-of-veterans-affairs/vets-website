module.exports = {
  meta: {
    docs: {
      description:
        'Web Components are preferred over deprecated React component library comopnents',
      category: 'Best Practices',
      recommended: false,
    },
    type: 'suggestion',
    fixable: 'code',
  },

  create(context) {
    return {
      JSXElement(node) {
        const componentName = node.openingElement.name;
        if (componentName.name === 'Telephone') {
          const patternNode = node.openingElement.attributes.find(
            n => n.name.name === 'pattern',
          );
          context.report({
            node,
            message: 'Testing',
            fix: fixer => {
              return [
                fixer.replaceText(componentName, 'va-telephone'),
                patternNode ? fixer.remove(patternNode) : null,
              ].filter(i => !!i);
            },
          });
        }
      },
    };
  },
};
