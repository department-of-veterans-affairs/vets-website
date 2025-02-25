import React from 'react';

// behavior list page
export const supportingEvidencePageTitle =
  'Select supporting documents about your mental health conditions';

export const supportingEvidenceDescription = (
  <>
    <p>
      Select all the types of supporting documents you plan to submit to support
      your claim for mental health conditions.
    </p>
    <p>
      Submitting supporting documents is optional. If you plan to submit these
      documents later, we’ll send you a letter with instructions for how to
      submit them.
    </p>
  </>
);

export const behaviorListAdditionalInformation = (
  <va-additional-info
    class="vads-u-margin-y--3"
    trigger="Why we’re asking this question"
  >
    <div>
      <p className="vads-u-margin-top--0">
        We understand that traumatic events from your military service may not
        have been reported or documented. In these situations, the information
        you provide about your behavioral changes will help us understand your
        situation and identify evidence to support your claim.
      </p>
    </div>
  </va-additional-info>
);

export const supportingEvidenceNoneLabel =
  'I don’t have any supporting documents to submit.';

export const behaviorListValidationError = (
  <va-alert status="error" uswds>
    <p className="vads-u-font-size--base">
      You selected one or more documents. You also selected "I don’t have any
      supporting documents to submit." Revise your selection so they don’t
      conflict to continue.
    </p>
  </va-alert>
);

/**
 * Returns true if 'none' selected, false otherwise
 * @param {object} formData
 * @returns {boolean}
 */
function hasSelectedNoneCheckbox(formData) {
  return Object.values(
    formData['view:supportingEvidenceNoneCheckbox'] || {},
  ).some(selected => selected === true);
}

/**
 * Returns an object with behavior section properties and boolean value if selections present within each section
 * @param {object} formData
 * @returns {object}
 */
function selectedDocumentsSections(formData) {
  const supportingEvidenceReportsSelected = Object.values(
    formData.supportingEvidenceReports || {},
  ).some(selected => selected === true);

  const supportingEvidenceRecordsSelected = Object.values(
    formData.supportingEvidenceRecords || {},
  ).some(selected => selected === true);

  const supportingEvidenceWitnessSelected = Object.values(
    formData.supportingEvidenceWitness || {},
  ).some(selected => selected === true);

  const supportingEvidenceOtherSelected = Object.values(
    formData.supportingEvidenceOther || {},
  ).some(selected => selected === true);

  const noneSelected = hasSelectedNoneCheckbox(formData);

  return {
    supportingEvidenceReports: supportingEvidenceReportsSelected,
    supportingEvidenceRecords: supportingEvidenceRecordsSelected,
    supportingEvidenceWitness: supportingEvidenceWitnessSelected,
    supportingEvidenceOther: supportingEvidenceOtherSelected,
    none: noneSelected,
  };
}

/**
 * Returns true if any selected behavior types, false otherwise
 * @param {object} formData
 * @returns {boolean}
 */
export function hasSelectedBehaviors(formData) {
  const selections = selectedDocumentsSections(formData);
  const {
    supportingEvidenceReports,
    supportingEvidenceRecords,
    supportingEvidenceWitness,
    supportingEvidenceOther,
  } = selections;
  return [
    supportingEvidenceReports,
    supportingEvidenceRecords,
    supportingEvidenceWitness,
    supportingEvidenceOther,
  ].some(selection => selection === true);
}

/**
 * Returns true if 'none' checkbox and other behavior types are selected
 * @param {object} formData
 * @returns {boolean}
 */

export function showConflictingAlert(formData) {
  const noneSelected = hasSelectedNoneCheckbox(formData);
  const somethingSelected = hasSelectedBehaviors(formData);

  return !!(noneSelected && somethingSelected);
}

/**
 * Validates that the 'none' checkbox is not selected if behavior types are also selected
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */

export function validateSupportingEvidenceSelections(errors, formData) {
  const isConflicting = showConflictingAlert(formData);
  const selections = selectedDocumentsSections(formData);

  // add error with no message to each checked section
  if (isConflicting === true) {
    errors['view:supportingEvidenceNoneCheckbox'].addError(' ');
    if (selections.supportingEvidenceReports === true) {
      errors.supportingEvidenceReports.addError(' ');
    }
    if (selections.supportingEvidenceRecords === true) {
      errors.supportingEvidenceRecords.addError(' ');
    }
    if (selections.supportingEvidenceWitness === true) {
      errors.supportingEvidenceWitness.addError(' ');
    }
    if (selections.supportingEvidenceOther === true) {
      errors.supportingEvidenceOther.addError(' ');
    }
  }
}
