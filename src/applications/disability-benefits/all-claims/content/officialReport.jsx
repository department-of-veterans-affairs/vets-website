import React from 'react';

export const officialReportPageTitle = 'Official report';

export const officialReportsDescription = (type = 'default') => {
  return (
    <>
      <p>
        Letting us know the types of reports filed about your traumatic event
        helps us get a copy of the report to evaluate your claim.
      </p>
      {type === 'mst' && (
        <p>
          When reporting a sexual assault during military service, two different
          reporting options are given. Restricted reporting are reports made
          while requesting confidentiality. Unrestricted reporting are reports
          made without requesting confidentiality. These options were not
          available before 2005.
        </p>
      )}
      <p>
        If you’re not sure which reports were filed, VA may send a follow-up
        letter with additional information.
      </p>
      <p>
        It’s OK if no official reports were filed for this event. We understand
        that traumatic events often go unreported. You can skip this question if
        you don’t feel comfortable answering.
      </p>
    </>
  );
};

export const reportTypesQuestion =
  'Were any of these types of official reports filed for the event you described?';

export const reportTypesHint = 'Select all that apply.';

export const otherReportTypesQuestion =
  'Other official report type not listed here:';

export const otherReportTypesExamples = (
  <va-additional-info trigger="Examples of ’other’ types of reports">
    <div>
      <ul>
        <li>After Action Report (AAR)</li>
        <li>Incident report</li>
        <li>Formal complaint</li>
        <li>Judge Advocate General (JAG)</li>
        <li>Criminal Investigative Division (CID)</li>
        <li>Naval Criminal Investigative Service (NCIS)</li>
      </ul>
    </div>
  </va-additional-info>
);

export const reportTypeValidationError = (
  <va-alert status="error" uswds>
    <p className="vads-u-font-size--base">
      You selected one or more reports filed for this event. You also selected
      “No official report was filed”.
    </p>
    <p>Revise your selection so they don’t conflict to continue.</p>
  </va-alert>
);

function selectedReportTypes(formData) {
  const militaryReportsSelected = Object.values(
    formData?.militaryReports || {},
  ).some(selected => selected === true);

  const otherReportsSelected = Object.entries(formData?.otherReports || {})
    .filter(([key]) => key !== 'none')
    .some(([_, selected]) => selected === true);

  const unlistedReportEntered =
    typeof formData?.unlistedReport === 'string' &&
    formData.unlistedReport.trim() !== '';

  return {
    militaryReports: militaryReportsSelected,
    otherReports: otherReportsSelected,
    unlistedReport: unlistedReportEntered,
  };
}

/**
 * Returns true if 'no report filed' AND other report types are also selected
 * @param {object} formData
 * @returns {boolean}
 */

export function showConflictingAlert(formData) {
  const selections = selectedReportTypes(formData);
  const { militaryReports, otherReports, unlistedReport } = selections;

  const noneSelected = !!(formData?.otherReports && formData.otherReports.none);
  const reportTypeSelected = militaryReports || otherReports || unlistedReport;

  return !!(noneSelected && reportTypeSelected);
}

/**
 * Validates that 'no report filed' is not selected if other report types are also selected
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */
export function validateReportSelections(errors, formData) {
  const isConflicting = showConflictingAlert(formData);
  const selections = selectedReportTypes(formData);

  // add error with no message to each checked section
  if (isConflicting) {
    errors.otherReports.addError(' ');

    if (selections.militaryReports) {
      errors.militaryReports.addError(' ');
    }
    if (selections.unlistedReport) {
      errors.unlistedReport.addError(' ');
    }
  }
}
