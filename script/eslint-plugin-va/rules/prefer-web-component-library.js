const MESSAGE =
  '<{{ reactComponent }}> can be replaced by <{{ webComponent }}>.';

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

const textInputTransformer = (context, node) => {
  const componentName = node.openingElement.name;
  const error = getPropNode(node, 'errorMessage');
  const additionalClass = getPropNode(node, 'additionalClass');
  const field = getPropNode(node, 'field');
  const placeholder = getPropNode(node, 'placeholder');
  const maxlength = getPropNode(node, 'charmax');
  const changeHandler = getPropNode(node, 'onValueChange');

  context.report({
    node,
    message:
      MESSAGE +
      `\nBEWARE: onValueChanged has been replaced with an onInput event handler and uses an event argument. This means the handler has to be updated to retrieve the value from event.target.value`,
    data: {
      reactComponent: componentName.name,
      webComponent: 'va-text-input',
    },
    suggest: [
      {
        desc: 'Migrate component',
        fix: fixer => {
          // Replace the node name
          return [
            fixer.replaceText(componentName, 'va-text-input'),
            error && fixer.replaceText(error.name, 'error'),
            additionalClass && fixer.replaceText(additionalClass.name, 'class'),
            field && fixer.remove(field),
            placeholder && fixer.remove(placeholder),
            maxlength && fixer.replaceText(maxlength.name, 'maxlength'),
            changeHandler && fixer.replaceText(changeHandler.name, 'onInput'),
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

const modalTransformer = (context, node) => {
  const openingTagNode = node.openingElement.name;
  const closingTagNode = node.closingElement?.name;
  const titleNode = getPropNode(node, 'title');
  const onCloseNode = getPropNode(node, 'onClose');
  const focusSelectorNode = getPropNode(node, 'focusSelector');
  const contentsNode = getPropNode(node, 'contents');
  const contentsValue = contentsNode?.value.expression || contentsNode?.value;
  const cssClassNode = getPropNode(node, 'cssClass');
  const hideCloseButtonNode = getPropNode(node, 'hideCloseButton');

  const manuallyUpdateProps =
    getPropNode(node, 'primaryButton') || getPropNode(node, 'secondaryButton');

  const sourceCode = context.getSourceCode();

  context.report({
    node,
    message: manuallyUpdateProps
      ? MESSAGE +
        `\nThe following props have changed and will need to be updated manually: primaryButton and secondaryButton.` +
        `\nprimaryButton is now primaryButtonText and primaryButtonClick.` +
        `\nsecondaryButton is now secondaryButtonText and secondaryButtonClick.`
      : MESSAGE,
    data: {
      reactComponent: openingTagNode.name,
      webComponent: 'VaModal',
    },
    suggest: [
      {
        desc: 'Migrate component',
        fix: fixer => {
          return [
            // Rename Modal to VaModal (Bindings)
            fixer.replaceText(openingTagNode, 'VaModal'),
            // Rename closing tag to VaModal if it exists
            closingTagNode && fixer.replaceText(closingTagNode, 'VaModal'),

            // If component is self-closing, insert the value of contents after the component opening tag
            // and insert a closing tag.
            // If the value of contents is a reference to JSX, add curly braces between the value.
            !closingTagNode &&
              contentsNode &&
              fixer.insertTextAfter(
                node.openingElement,
                (contentsValue.type === 'Identifier'
                  ? `{${sourceCode.getText(contentsValue)}}`
                  : sourceCode.getText(contentsValue)) + '</VaModal>',
              ),

            // Rename title prop to modalTitle if it exists
            titleNode && fixer.replaceText(titleNode.name, 'modalTitle'),

            // Rename onClose prop to onCloseEvent if it exists
            onCloseNode && fixer.replaceText(onCloseNode.name, 'onCloseEvent'),

            // Rename cssClass prop to className if it exists
            cssClassNode && fixer.replaceText(cssClassNode.name, 'className'),

            // Remove contents prop if it exists - replaced by slot
            contentsNode && fixer.remove(contentsNode),

            // Remove focusSelectorNode prop if it exists
            focusSelectorNode && fixer.remove(focusSelectorNode),

            // Remove focusSelectorNode prop if it exists
            hideCloseButtonNode && fixer.remove(hideCloseButtonNode),

            // Remove self-closing tag slash if component is self-closing initially
            !closingTagNode &&
              fixer.removeRange(
                [
                  node.openingElement.range[1] - 2,
                  node.openingElement.range[1] - 1,
                ],
                '',
              ),
          ].filter(i => !!i);
        },
      },
    ],
  });
};

const paginationTransformer = (context, node) => {
  const componentName = node.openingElement.name;
  const importNode = context
    .getAncestors()[0]
    .body.find(
      node =>
        node.type === 'ImportDeclaration' &&
        node.source.value.includes(
          `@department-of-veterans-affairs/component-library/${
            componentName.name
          }`,
        ),
    );

  context.report({
    node,
    message:
      MESSAGE +
      `\nBEWARE: onPageSelect has been updated to be an event. This means the handler for onPageSelect has to be updated to retrieve the page from event.detail.page`,
    data: {
      reactComponent: componentName.name,
      webComponent: 'VaPagination',
    },
    suggest: [
      {
        desc: 'Migrate component',
        fix: fixer => {
          return [
            // Replace import name with bindings
            fixer.replaceText(
              importNode.specifiers[0].local,
              `{ VaPagination }`,
            ),

            // Update import path to react-bindings
            fixer.replaceText(
              importNode.source,
              `'web-components/react-bindings'`,
            ),

            // Rename component name Pagination to VaPagination
            // We are using bindings because onPageSelect is an event
            fixer.replaceText(componentName, 'VaPagination'),
          ].filter(i => !!i);
        },
      },
    ],
  });
};
const tableTransformer = (context, node) => {
  const componentName = node.openingElement.name;
  const currentSortNode = getPropNode(node, 'currentSort');
  const dataNode = getPropNode(node, 'data');
  const fieldsNode = getPropNode(node, 'fields');
  const dataValue = dataNode?.value.expression || dataNode?.value;
  const fieldsValue = fieldsNode?.value.expression || fieldsNode?.value;
  const sourceCode = context.getSourceCode();
  const importNode = context
    .getAncestors()[0]
    .body.find(
      node =>
        node.type === 'ImportDeclaration' &&
        node.source.value.includes(
          `@department-of-veterans-affairs/component-library/${
            componentName.name
          }`,
        ),
    );

  context.report({
    node,
    message: MESSAGE,
    data: {
      reactComponent: componentName.name,
      webComponent: 'va-table',
    },
    suggest: [
      {
        desc: 'Migrate component',
        fix: fixer => {
          return [
            // Import utility function that can easily handle the existing props
            // for the React version of `<Table>`
            fixer.replaceText(
              importNode.specifiers[0].local,
              `{ generateTableChildren }`,
            ),

            // Remove Table name from import path
            fixer.replaceText(
              importNode.source,
              `'@department-of-veterans-affairs/component-library'`,
            ),

            // Rename component tag
            fixer.replaceText(componentName, 'va-table'),

            // Remove the data prop
            fixer.remove(dataNode),

            // Remove the fields prop
            fixer.remove(fieldsNode),

            // Remove the currentSort prop
            currentSortNode && fixer.remove(currentSortNode),

            // Add `sort-column` prop
            currentSortNode &&
              fixer.insertTextBefore(currentSortNode, 'sort-column="0"'),

            // Add `descending` prop
            currentSortNode &&
              fixer.insertTextBefore(currentSortNode, ' descending'),

            // Add a closing tag along with calling the helper
            // function to generate children
            fixer.insertTextAfter(
              node.openingElement,
              `{generateTableChildren(${sourceCode.getText(
                dataValue,
              )}, ${sourceCode.getText(fieldsValue)})}</va-table>`,
            ),
            // Remove self-closing tag slash
            fixer.removeRange(
              [
                node.openingElement.range[1] - 2,
                node.openingElement.range[1] - 1,
              ],
              '',
            ),
          ].filter(i => !!i);
        },
      },
    ],
  });
};

/**
 * Stores the result of a check that determines if a component is part of
 * the Design System component-library.
 *
 * This object has the following shape:
 * { [filename]: { [componentName]: boolean } }
 *
 * Example:
 * { 'src/applications/claims-status/components/ClaimsBreadcrumbs.jsx': { 'Breadcrumbs': true } }
 */
let isLibraryComponent = {};

/**
 * Builds the isLibraryComponent object by organizing components into filenames,
 * checks if the component is part of the Design System component-library
 * and stores the result as a boolean.
 *
 * @param {object} context
 * @param {string} componentName
 */
const updateIsLibraryImportObj = (context, componentName) => {
  isLibraryComponent[context.getFilename()] = {
    ...isLibraryComponent[context.getFilename()],
    [componentName]: context
      .getAncestors()[0]
      .body.some(
        node =>
          node.type === 'ImportDeclaration' &&
          node.source.value.includes(
            `@department-of-veterans-affairs/component-library/${componentName}`,
          ),
      ),
  };
};

/**
 * This function returns a boolean value indicating whether a component is part of the
 * Design System component-library. It utilizes the helper updateIsLibraryImportObj to
 * build the isLibraryComponent object and returns true or false for a given componentName
 * and context filename. Skips check if result exists for a given componentName and context
 * filename.
 *
 * @param {object} context
 * @param {string} componentName
 * @returns {boolean} true if component is part of the Design System component-library
 */
const isLibraryImport = (context, componentName) => {
  if (
    !isLibraryComponent
      .hasOwnProperty(context.getFilename())
      ?.hasOwnProperty(componentName)
  ) {
    updateIsLibraryImportObj(context, componentName);
  }
  return isLibraryComponent[context.getFilename()][componentName];
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
        const componentName = node.openingElement.name.name;

        // If the component is not part of the Design System component-library,
        // then do not display an ESLint warning.
        if (!isLibraryImport(context, componentName)) return;

        switch (componentName) {
          case 'Breadcrumbs':
            breadcrumbsTransformer(context, node);
            break;
          case 'Modal':
            modalTransformer(context, node);
            break;
          case 'Pagination':
            paginationTransformer(context, node);
            break;
          case 'Table':
            tableTransformer(context, node);
            break;
          case 'Telephone':
            telephoneTransformer(context, node);
            break;
          case 'TextInput':
            textInputTransformer(context, node);
            break;
          default:
            break;
        }
      },
    };
  },
};
