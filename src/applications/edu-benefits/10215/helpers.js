import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export const isCurrentOrPastDate = date => {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dateObj >= today;
};

export const formatDateYyyyMmDd = day => {
  const yyyy = day.getFullYear();
  let mm = day.getMonth() + 1; // Month is zero-based
  let dd = day.getDate();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;
  return `${yyyy}-${mm}-${dd}`;
};

export const daysAgoYyyyMmDd = numberOfDays => {
  const day = new Date();
  day.setDate(day.getDate() - numberOfDays);
  return formatDateYyyyMmDd(day);
};

export const futureDateYyyyMmDd = numberOfDays => {
  const day = new Date();
  day.setDate(day.getDate() + numberOfDays);
  return formatDateYyyyMmDd(day);
};

export const getTodayDateYyyyMmDd = () => {
  const today = new Date();
  return formatDateYyyyMmDd(today);
  /*
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Month is zero-based
  let dd = today.getDate();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;
  return `${yyyy}-${mm}-${dd}`; */
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
  const total = parseFloat((supported + nonSupported).toFixed(2));
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

export const childContent = (pdfUrl, trackingPrefix, goBack) => (
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
        <div
          itemProp="itemListElement"
          className="confirmation-save-pdf-download-section screen-only custom-classname"
        >
          <h2>Download and save your form</h2>
          <p>
            Make sure that your completed form is saved as a PDF on your device.{' '}
            <span className="vads-u-display--inline-block">
              <va-link
                download
                filetype="PDF"
                href={pdfUrl}
                onClick={() =>
                  recordEvent({
                    event: `${trackingPrefix}confirmation-pdf-download`,
                  })
                }
                text="Download VA Form 22-10215"
              />
            </span>
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Upload your PDF to the Education File Upload Portal">
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
        className="custom-classname"
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
      After you submit your 85/15 rule enrollment ratios, we will review them
      within 7-10 business days. Once we review your submission, we will email
      you with our determinations, and any next steps.
    </p>
  </div>
);
export const decimalSchema = {
  type: 'string',
  // zero or more digits, optionally “.” plus one or two digits
  pattern: '^\\d*(?:\\.\\d{1,2})?$',
};
