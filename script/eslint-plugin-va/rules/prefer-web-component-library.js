const MESSAGE =
  '<{{ reactComponent }}> can be replaced by <{{ webComponent }}>';

const getPropNode = (node, propName) =>
  node.openingElement.attributes.find(n => n.name.name === propName);

// Allows us to check if the JSX element we've identified is imported from
// the component library. Some applications have their own components with the
// same names as Design System components.
// TODO: Consider improving the performance of this w/ memoization
const isLibraryImport = (context, componentName) => {
  let isLibraryComponent = false;
  const allImports = context
    .getAncestors()[0]
    .body.filter(node => node.type === 'ImportDeclaration');
  const componentLibraryImports = allImports.filter(node =>
    node.source.value.includes(
      '@department-of-veterans-affairs/component-library',
    ),
  );

  componentLibraryImports.forEach(imp => {
    if (imp.specifiers.find(i => i.local.name === componentName))
      isLibraryComponent = true;
  });

  return isLibraryComponent;
};

const telephoneTransformer = (context, node) => {
  const componentName = node.openingElement.name;
  const patternNode = getPropNode(node, 'pattern');
  const notClickableNode = getPropNode(node, 'notClickable');
  const contactNode = getPropNode(node, 'contact');
  const contactValue = contactNode?.value.expression;

  const stripHyphens = contactValue?.type === 'Literal';
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
            stripHyphens &&
              fixer.replaceText(
                contactValue,
                `'${contactValue.value.replace(/[^\d]/g, '')}'`,
              ),
            international &&
              fixer.insertTextBefore(patternNode, 'international'),
            patternNode && fixer.remove(patternNode),
            notClickableNode &&
              fixer.replaceText(notClickableNode, 'not-clickable'),
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
        if (
          isLibraryImport(context, 'Telephone') &&
          componentName.name === 'Telephone'
        ) {
          telephoneTransformer(context, node);
        }
      },
    };
  },
};
