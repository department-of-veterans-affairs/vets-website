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

export const militaryReportsHint =
  'Select any military incident reports filed for this event.';

export const noReportHint =
  'Select this option if you didn’t have any reports filed, don’t know about any official reports, or prefer not to include them.';

export const otherReportTypesTitle =
  'Other official report type not listed here:';

export const otherReportsHint =
  'Select any any other types of reports filed for this event.';

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

export const removePoliceReportModalContent = (
  <>
    <p>
      If you change your selection, we’ll delete information you provided about
      this report.
    </p>
  </>
);

export function selectedReportTypes(formData = {}) {
  const militaryReportsSelected = Object.values(
    formData.militaryReports || {},
  ).some(value => value === true);

  const otherReportsSelected = Object.entries(formData.otherReports || {})
    .filter(([key]) => key !== 'none')
    .some(([, selected]) => selected === true);

  const unlistedReportEntered =
    typeof formData.unlistedReport === 'string' &&
    formData.unlistedReport.trim().length > 0;

  return {
    militaryReports: militaryReportsSelected,
    otherReports: otherReportsSelected,
    unlistedReport: unlistedReportEntered,
  };
}

/**
 * Returns true if 'no report filed' AND any other report type is also selected
 * @param {object} formData
 * @returns {boolean}
 */
export function showConflictingAlert(formData = {}) {
  const { militaryReports, otherReports, unlistedReport } = selectedReportTypes(
    formData,
  );

  const noneSelected = formData?.noReport?.none === true;
  const reportTypeSelected = militaryReports || otherReports || unlistedReport;

  return noneSelected && reportTypeSelected;
}

/**
 * Validates that 'no report filed' is not selected if any other report type is also selected
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */
export function validateReportSelections(errors, formData) {
  if (showConflictingAlert(formData) && errors?.noReport) {
    errors.noReport.addError(
      'If you select no reports to include, unselect other reports before continuing.',
    );
  }
}
