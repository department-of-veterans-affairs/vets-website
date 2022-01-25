const getPropNode = (node, propName) =>
  node.openingElement.attributes.find(n => n.name.name === propName);

const telephoneTransformer = (context, node) => {
  const componentName = node.openingElement.name;
  const patternNode = getPropNode(node, 'pattern');
  const notClickableNode = getPropNode(node, 'notClickable');

  let international = false;
  if (patternNode) {
    const patternType = patternNode.value.expression.property;
    if (patternType.name === 'OUTSIDE_US') international = true;
  }

  context.report({
    node,
    message: 'Testing',
    fix: fixer => {
      // Replace the node name
      // and remove the `pattern` prop if it's there
      return [
        fixer.replaceText(componentName, 'va-telephone'),
        international
          ? fixer.insertTextBefore(patternNode, 'international')
          : null,
        patternNode ? fixer.remove(patternNode) : null,
        notClickableNode
          ? fixer.replaceText(notClickableNode, 'not-clickable')
          : null,
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
