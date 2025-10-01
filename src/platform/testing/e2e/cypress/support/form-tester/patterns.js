/* eslint-disable no-use-before-define */

// `.vads-web-component-pattern` elements
export const PATTERN_CLASS_TO_FILL_ACTION = {
  'vads-web-component-pattern-address': addressPattern,
  'wc-pattern-array-builder': arrayBuilderSummaryPattern,
};

/**
 * @param {jQuery} $patternElement
 */
function extractBaseNameFromFirstField($patternElement) {
  const $firstField = $patternElement.find('[name]').first();
  if ($firstField.length === 0) return null;

  const fieldName = $firstField.attr('name');
  if (!fieldName) return null;

  // Extract base name by removing the last part after underscore
  // e.g., "root_view:hasTreatmentRecords_add_another" -> "root_view:hasTreatmentRecords"
  const lastUnderscoreIndex = fieldName.lastIndexOf('_');
  return lastUnderscoreIndex !== -1
    ? fieldName.substring(0, lastUnderscoreIndex)
    : fieldName;
}

/**
 * General array builder pattern that auto-detects the type and handles appropriately
 */
function arrayBuilderSummaryPattern() {
  return cy.arrayBuilderSummaryContinue().then(result => {
    // If pattern clicked "Add another", signal to abort further processing
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
 * @param {jQuery} $fieldGroup
 * @param {Set} touchedFields
 */
export const markPatternFieldsAsProcessed = ($fieldGroup, touchedFields) => {
  const patternFields = $fieldGroup.find('.vads-web-component-pattern-field');
  patternFields.each((index, field) => {
    const fieldKey = field.getAttribute('name') || field.getAttribute('id');
    if (fieldKey) {
      touchedFields.add(fieldKey);
    }
  });
  $fieldGroup.data('pattern-processed', true);
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

        // Automatically mark as processed after pattern handler completes
        // Check if this is a single-field pattern vs a container pattern
        // Container patterns have child elements with .vads-web-component-pattern-field class
        const hasChildFields =
          $element.find('.vads-web-component-pattern-field').length > 0;

        if (hasChildFields && $element.hasClass('vads-web-component-pattern')) {
          // For container patterns, mark all child fields as processed
          markPatternFieldsAsProcessed($element, touchedFields);
        } else {
          // For single-field patterns, mark the field itself as processed
          const fieldKey = $element.attr('name') || $element.attr('id');
          if (fieldKey) {
            touchedFields.add(fieldKey);
          }
          $element.data('pattern-processed', true);
        }
      });
    }

    // No pattern handler found, just mark as processed
    if ($element.hasClass('vads-web-component-pattern')) {
      markPatternFieldsAsProcessed($element, touchedFields);
    } else {
      const fieldKey = $element.attr('name') || $element.attr('id');
      if (fieldKey) {
        touchedFields.add(fieldKey);
      }
      $element.data('pattern-processed', true);
    }
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
