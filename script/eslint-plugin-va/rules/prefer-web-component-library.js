const telephoneTransformer = (context, node) => {
  const componentName = node.openingElement.name;
  const patternNode = node.openingElement.attributes.find(
    n => n.name.name === 'pattern',
  );
  context.report({
    node,
    message: 'Testing',
    fix: fixer => {
      // Replace the node name
      // and remove the `pattern` prop if it's there
      return [
        fixer.replaceText(componentName, 'va-telephone'),
        patternNode ? fixer.remove(patternNode) : null,
      ].filter(i => !!i);
    },
  });
};

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
          telephoneTransformer(context, node);
        }
      },
    };
  },
};
