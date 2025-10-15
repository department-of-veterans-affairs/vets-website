/* eslint-disable no-use-before-define */

// `.vads-web-component-pattern` elements
export const PATTERN_CLASS_TO_FILL_ACTION = {
  'vads-web-component-pattern-address': addressPattern,
  'wc-pattern-array-builder': arrayBuilderSummaryPattern,
};

/**
 * @param {jQuery} $patternElement
 */
export function extractBaseNameFromFirstField($patternElement) {
  const patternFields = $patternElement.find(
    '.vads-web-component-pattern-field',
  );
  if (!patternFields.length) {
    return null;
  }

  const firstField = patternFields.first();
  const fieldName = firstField.attr('name') || firstField.attr('id');
  if (!fieldName) {
    return null;
  }

  // Remove the last segment after the final underscore
  // e.g. root_address_city -> root_address
  return fieldName.replace(/_[^_]+$/, '');
}

/**
 * General array builder pattern that auto-detects the type and handles appropriately
 */
function arrayBuilderSummaryPattern() {
  return cy.arrayBuilderSummaryContinue().then(result => {
    // we might want to abort processing if pattern clicked "Add another"
    // (routes to new page)
    const abortProcessing = result?.abortProcessing === true;
    return cy.wrap({ abortProcessing }, { log: false });
  });
}

/**
 * @param {jQuery} $element
 * @param {string} arrayItemPath
 */
function addressPattern($element, arrayItemPath) {
  const baseName = extractBaseNameFromFirstField($element);

  return cy.findData({ key: baseName, arrayItemPath }).then(data => {
    if (typeof data === 'undefined') {
      return cy.wrap(null, { log: false });
    }

    const addressFieldName = baseName.replace(/^root_/, '');
    return cy.fillAddressWebComponentPattern(addressFieldName, data);
  });
}

/**
 * @param {jQuery} $pattern
 * @param {Set} touchedFields
 */
export const markPatternFieldsAsProcessed = ($pattern, touchedFields) => {
  const patternFields = $pattern.find('.vads-web-component-pattern-field');
  patternFields.each((index, field) => {
    const fieldKey = field.getAttribute('name') || field.getAttribute('id');
    if (fieldKey) {
      touchedFields.add(fieldKey);
    }
  });

  const elementFieldKey = $pattern.attr('name') || $pattern.attr('id');
  if (elementFieldKey) {
    touchedFields.add(elementFieldKey);
  }

  $pattern.data('pattern-processed', true);
};

/**
 * @param {jQuery} $form
 * @param {string} arrayItemPath
 * @param {Set} touchedFields
 * @returns {Cypress.Chainable<{abortProcessing: boolean}>}
 */
export const fillPatterns = ($form, arrayItemPath, touchedFields) => {
  const patterns = $form.find('.vads-web-component-pattern');
  const patternFields = $form
    .find('.vads-web-component-pattern-field')
    .filter((index, field) => {
      return !Cypress.$(field).closest('.vads-web-component-pattern').length;
    });

  const allPatterns = [...patterns, ...patternFields];

  if (!allPatterns.length) {
    return cy.wrap({ abortProcessing: false }, { log: false });
  }

  const groupsArray = Array.from(allPatterns);
  let abortProcessing = false;

  const processGroup = groupElement => {
    const $element = Cypress.$(groupElement);

    if ($element.data('pattern-processed')) {
      return cy.wrap(null, { log: false });
    }

    // Find pattern handler and let it handle everything
    const patternClass = Object.keys(PATTERN_CLASS_TO_FILL_ACTION).find(
      className => $element.hasClass(className),
    );

    if (patternClass) {
      return PATTERN_CLASS_TO_FILL_ACTION[patternClass](
        $element,
        arrayItemPath,
      ).then(result => {
        if (result?.abortProcessing === true) {
          abortProcessing = true;
        }

        markPatternFieldsAsProcessed($element, touchedFields);
      });
    }

    markPatternFieldsAsProcessed($element, touchedFields);
    return cy.wrap(null, { log: false });
  };

  return groupsArray
    .reduce(
      (chain, group) => chain.then(() => processGroup(group)),
      cy.wrap(null, { log: false }),
    )
    .then(() => {
      return cy.wrap({ abortProcessing }, { log: false });
    });
};
