const MESSAGE =
  '<{{ reactComponent }}> can be replaced by <{{ webComponent }}>';

const getPropNode = (node, propName) =>
  node.openingElement.attributes.find(n => n.name.name === propName);

const telephoneTransformer = (context, node) => {
  const componentName = node.openingElement.name;
  const patternNode = getPropNode(node, 'pattern');
  const notClickableNode = getPropNode(node, 'notClickable');
  const international =
    patternNode?.value.expression.property.name === 'OUTSIDE_US';

  context.report({
    node,
    message: MESSAGE,
    data: {
      reactComponent: componentName.name,
      webComponent: 'va-telephone',
    },
    suggest: [
      {
        desc: 'Migrate component',
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
      },
    ],
  });
};

module.exports = {
  meta: {
    docs: {
      description:
        'Web Components are preferred over deprecated React component library components',
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
