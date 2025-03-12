import React from 'react';

export const treatmentReceivedTitle =
  'Treatment received for traumatic events and behavioral changes';

export const treatmentReceivedDescription = (
  <>
    <p>
      Select all the medical provider types you visited for treating the impact
      of your traumatic events including any behavioral changes you experienced.
    </p>
    <p>
      You may not have received treatment for your traumatic events. It’s OK if
      you don’t report receiving treatment at any provider.
    </p>
    <p>
      You’ll be able to upload or request records from these treatment providers
      for VA to review in <strong>Section 4: Supporting evidence</strong>
    </p>
  </>
);

export const treatmentReceivedNoneLabel =
  'I didn’t receive treatment for my traumatic events.';

/**
 * Returns true if 'none' selected, false otherwise
 * @param {object} formData
 * @returns {boolean}
 */
function hasSelectedNoneCheckbox(formData) {
  return Object.values(formData['view:treatmentNoneCheckbox'] || {}).some(
    selected => selected === true,
  );
}

/**
 * Returns an object with treatment received properties and boolean value if selections present within each section
 * @param {object} formData
 * @returns {object}
 */
function treatmentReceivedSections(formData) {
  const treatmentReceivedVaProviderSelected = Object.values(
    formData.treatmentReceivedVaProvider || {},
  ).some(selected => selected === true);

  const treatmentReceivedNonVaProviderSelected = Object.values(
    formData.treatmentReceivedNonVaProvider || {},
  ).some(selected => selected === true);

  const noneSelected = hasSelectedNoneCheckbox(formData);

  return {
    treatmentReceivedVaProvider: treatmentReceivedVaProviderSelected,
    treatmentReceivedNonVaProvider: treatmentReceivedNonVaProviderSelected,
    none: noneSelected,
  };
}

/**
 * Returns true if there are any selected providers, false otherwise
 * @param {object} formData
 * @returns {boolean}
 */
export function hasSelectedProviders(formData) {
  const selections = treatmentReceivedSections(formData);
  const {
    treatmentReceivedVaProvider,
    treatmentReceivedNonVaProvider,
  } = selections;
  return [treatmentReceivedVaProvider, treatmentReceivedNonVaProvider].some(
    selection => selection === true,
  );
}

/**
 * Returns true if 'none' checkbox and other providers are selected
 * @param {object} formData
 * @returns {boolean}
 */

export function showConflictingAlert(formData) {
  const noneSelected = hasSelectedNoneCheckbox(formData);
  const somethingSelected = hasSelectedProviders(formData);

  return !!(noneSelected && somethingSelected);
}

/**
 * Validates that the 'none' checkbox is not selected if providers are also selected
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */

export function validateProviders(errors, formData) {
  const isConflicting = showConflictingAlert(formData);

  // add error message to none checkbox
  if (isConflicting === true) {
    errors['view:treatmentNoneCheckbox'].addError(
      'If you select no treatment providers to include, unselect other treatment providers before continuing.',
    );
  }
}
