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
      If you didn’t receive any treatment for your traumatic events, select{' '}
      <strong>‘I didn’t receive treatment for my traumatic events.’</strong>
    </p>
    <p>
      You’ll be able to upload or request records from these treatment providers
      for VA to review in <strong>Section 4: Supporting evidence</strong>
    </p>
  </>
);

export const treatmentReceivedNoneLabel =
  'I didn’t receive treatment for my traumatic events.';

export const providerListValidationError = (
  <va-alert status="error" uswds>
    <p className="vads-u-font-size--base">
      You selected one or more types of reports for this event, but you also
      selected ‘I don’t have any supporting documents to submit.’
    </p>
    <p>Revise your selection so they don’t conflict to continue.</p>
  </va-alert>
);

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
  const selections = treatmentReceivedSections(formData);

  // add error with no message to each checked section
  if (isConflicting === true) {
    errors['view:treatmentNoneCheckbox'].addError(' ');
    if (selections.treatmentReceivedVaProvider === true) {
      errors.treatmentReceivedVaProvider.addError(' ');
    }
    if (selections.treatmentReceivedNonVaProvider === true) {
      errors.treatmentReceivedNonVaProvider.addError(' ');
    }
  }
}
