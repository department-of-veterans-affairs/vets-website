const MESSAGE =
  '<{{ reactComponent }}> can be replaced by <{{ webComponent }}>';

const getPropNode = (node, propName) =>
  node.openingElement.attributes.find(n => n.name.name === propName);

const telephoneTransformer = (context, node) => {
  const componentName = node.openingElement.name;
  const patternNode = getPropNode(node, 'pattern');
  const notClickableNode = getPropNode(node, 'notClickable');
  const contactNode = getPropNode(node, 'contact');
  const contactValue = contactNode?.value.expression || contactNode?.value;

  const stripHyphens = contactValue?.type === 'Literal';
  const international =
    patternNode?.value.expression?.property?.name === 'OUTSIDE_US';

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
              fixer.replaceTextRange(
                // Leave the quotes alone
                [contactValue.range[0] + 1, contactValue.range[1] - 1],
                contactValue.value.replace(/[^\d]/g, ''),
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

const breadcrumbsTransformer = (context, node) => {
  const componentName = node.openingElement.name;
  const closingTag = node.closingElement.name;
  const selectedFacilityNode = getPropNode(node, 'selectedFacility');

  context.report({
    node,
    message: MESSAGE,
    data: {
      reactComponent: componentName.name,
      webComponent: 'va-breadcrumbs',
    },
    suggest: [
      {
        desc: 'Migrate component',
        fix: fixer => {
          // Replace opening and close tags
          // and remove `selectedFacilityNode` prop if present
          return [
            fixer.replaceText(componentName, 'va-breadcrumbs'),
            fixer.replaceText(closingTag, 'va-breadcrumbs'),
            selectedFacilityNode && fixer.remove(selectedFacilityNode),
          ].filter(i => !!i);
        },
      },
    ],
  });
};

const isLibraryImport = (context, componentName) => {
  const isLibraryComponent = context
    .getAncestors()[0]
    .body.some(
      node =>
        node.type === 'ImportDeclaration' &&
        node.source.value.includes(
          `@department-of-veterans-affairs/component-library/${componentName}`,
        ),
    );

  return isLibraryComponent;
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

        if (!isLibraryImport(context, componentName.name)) return;

        switch (componentName.name) {
          case 'Breadcrumbs':
            breadcrumbsTransformer(context, node);
            break;
          case 'Telephone':
            telephoneTransformer(context, node);
            break;
          default:
            break;
        }
      },
    };
  },
};
