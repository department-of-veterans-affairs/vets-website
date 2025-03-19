import React from 'react';

export const supportingEvidencePageTitle =
  'Select supporting documents about your mental health conditions';

export const supportingEvidenceDescription = (
  <>
    <p>
      Select all the types of supporting documents you plan to submit to support
      your claim for mental health conditions.
    </p>
    <p>Submitting supporting documents is optional.</p>
    <ul>
      <li>
        If you wish to include these documents with your submission, you’ll be
        able to upload them in <strong>Section 4: Supporting evidence.</strong>
      </li>
      <li>
        If you plan to submit these documents later we’ll mail you a letter with
        instructions once we’ve received your claim.
      </li>
    </ul>
  </>
);

export const supportingEvidenceBuddyStatement = (
  <va-additional-info
    class="vads-u-margin-y--3"
    trigger="Learn more about buddy statements"
  >
    <div>
      <p className="vads-u-margin-top--0">
        A buddy statement is a written statement from someone who knows about
        your condition or related events.
      </p>
      <p>
        Someone can provide a buddy statement to support your claim in either of
        these 2 ways:
      </p>
      <ul>
        <li>
          <va-link
            external
            href="https://www.va.gov/supporting-forms-for-claims/lay-witness-statement-form-21-10210/introduction"
            text="Complete VA Form 21-10210 online"
          />
          , <strong>or</strong>
        </li>
        <li>
          Give you a PDF version of their completed VA Form 21-10210 to upload
          on the next screen
          <va-link
            external
            href="https://www.va.gov/supporting-forms-for-claims/lay-witness-statement-form-21-10210/introduction"
            text="Get VA Form 21-10210 to download"
          />
        </li>
      </ul>
    </div>
  </va-additional-info>
);

export const supportingEvidenceAdditionalInformation = (
  <va-additional-info
    class="vads-u-margin-y--3"
    trigger="Why we’re asking this"
  >
    <div>
      <p className="vads-u-margin-top--0">
        We understand that traumatic events from your military service may not
        have been reported or documented. In these situations, the supporting
        documents you provide will help us understand your situation and
        identify evidence to support your claim.
      </p>
    </div>
  </va-additional-info>
);

export const supportingEvidenceNoneLabel =
  'I don’t have any supporting documents to submit.';

/**
 * Returns true if 'none' selected, false otherwise
 * @param {object} formData
 * @returns {boolean}
 */
function hasSelectedNoneCheckbox(formData) {
  return Object.values(formData.supportingEvidenceNoneCheckbox || {}).some(
    selected => selected === true,
  );
}

/**
 * Returns an object with evidence properties and boolean value if selections present within each section
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

  const supportingEvidenceUnlistedAdded = !!(typeof formData.supportingEvidenceUnlisted ===
  'string'
    ? formData.supportingEvidenceUnlisted.trim()
    : '');

  const noneSelected = hasSelectedNoneCheckbox(formData);

  return {
    supportingEvidenceReports: supportingEvidenceReportsSelected,
    supportingEvidenceRecords: supportingEvidenceRecordsSelected,
    supportingEvidenceWitness: supportingEvidenceWitnessSelected,
    supportingEvidenceOther: supportingEvidenceOtherSelected,
    supportingEvidenceUnlisted: supportingEvidenceUnlistedAdded,
    none: noneSelected,
  };
}

/**
 * Returns true if any selected supporting evidence, false otherwise
 * @param {object} formData
 * @returns {boolean}
 */
export function hasSelectedSupportingEvidence(formData) {
  const selections = selectedDocumentsSections(formData);
  const {
    supportingEvidenceReports,
    supportingEvidenceRecords,
    supportingEvidenceWitness,
    supportingEvidenceOther,
    supportingEvidenceUnlisted,
  } = selections;
  return [
    supportingEvidenceReports,
    supportingEvidenceRecords,
    supportingEvidenceWitness,
    supportingEvidenceOther,
    supportingEvidenceUnlisted,
  ].some(selection => selection === true);
}

/**
 * Returns true if 'none' checkbox and other supporting evidence is selected
 * @param {object} formData
 * @returns {boolean}
 */

export function showConflictingAlert(formData) {
  const noneSelected = hasSelectedNoneCheckbox(formData);
  const somethingSelected = hasSelectedSupportingEvidence(formData);

  return !!(noneSelected && somethingSelected);
}

/**
 * Validates that the 'none' checkbox is not selected if supporting evidence is also selected
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */

export function validateSupportingEvidenceSelections(errors, formData) {
  const isConflicting = showConflictingAlert(formData);

  // add error message to none checkbox if conflict exists
  if (isConflicting === true) {
    errors.supportingEvidenceNoneCheckbox.addError(
      'If you select no supporting documents to include, unselect other supporting documents before continuing.',
    );
  }
}
