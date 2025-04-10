import React from 'react';

export const getTodayDateYyyyMmDd = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Month is zero-based
  let dd = today.getDate();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;
  return `${yyyy}-${mm}-${dd}`;
};

export const isTermEndBeforeTermStartDate = (
  termStartDate,
  dateOfCalculations,
) => {
  const startDate = new Date(termStartDate);
  const calculationDate = new Date(dateOfCalculations);
  return calculationDate < startDate;
};

export const isWithinThirtyDaysLogic = (termStartDate, dateOfCalculations) => {
  const startDate = new Date(termStartDate);
  const calculationDate = new Date(dateOfCalculations);
  const timeDifference = Math.abs(
    calculationDate.getTime() - startDate.getTime(),
  );
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference < 30;
};

export const getFTECalcs = program => {
  const supported = Number(program?.fte?.supported) || 0;
  const nonSupported = Number(program?.fte?.nonSupported) || 0;
  const total = supported + nonSupported;
  const supportedFTEPercent =
    Number.isNaN(total) || supported === 0 || total === 0
      ? null
      : `${((supported / total) * 100).toFixed(2).replace(/[.,]00$/, '')}%`;
  return {
    supported,
    nonSupported,
    total,
    supportedFTEPercent,
  };
};

export const childContent = (downloadLink, goBack) => (
  <div data-testid="download-link">
    <va-alert close-btn-aria-label="Close notification" status="into" visible>
      <h2 slot="headline">Complete all submission steps</h2>
      <p className="vads-u-margin-y--0">
        This form requires additional steps for successful submission. Follow
        the instructions below carefully to ensure your form is submitted
        correctly.
      </p>
    </va-alert>
    <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
      To submit your form, follow the steps below
    </h2>
    <va-process-list uswds>
      <va-process-list-item>
        <div itemProp="itemListElement">
          <p>{downloadLink}</p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Upload the form to the Education File Upload Portal">
        <div itemProp="itemListElement">
          <p>
            Visit the&nbsp;
            <va-link
              external
              text="Education File Upload Portal"
              href="https://www.my.va.gov/EducationFileUploads/s/"
            />
            , and upload your saved VA Form 22-10215.
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Submit your form">
        <div itemProp="itemListElement">
          <p>Once uploaded, click submit to finalize your request.</p>
        </div>
      </va-process-list-item>
    </va-process-list>
    <p>
      <va-button
        secondary
        text="Print this page"
        data-testid="print-page"
        onClick={() => window.print()}
      />
    </p>
    <p>
      <va-link
        onClick={goBack}
        class="screen-only vads-u-margin-top--1 vads-u-font-weight--bold"
        data-testid="back-button"
        text="Back"
        href="#"
      />
    </p>
    <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
      What are my next steps?
    </h2>
    <p>
      After you submit your 85/15 Rule enrollment ratios, we will review them
      within 7-10 business days. Once we review your submission, we will email
      you with our determinations, and any next steps.
    </p>
  </div>
);
