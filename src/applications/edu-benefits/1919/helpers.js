import React from 'react';

import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

export const showConflictOfInterestText = () => {
  window.dataLayer.push({
    event: 'edu-1919--form-help-text-clicked',
    'help-text-label': 'Review the conflict of interest policy',
  });
};

export const conflictOfInterestPolicy = (
  <va-additional-info
    trigger="Review the conflict of interest policy"
    onClick={showConflictOfInterestText}
  >
    <p>
      Title 38 C.F.R. 21.4202(c), 21.5200(c), 21.7122(e)(6), and
      21.7622(f)(4)(iv) prohibit the payment of educational assistance to any
      Veteran or eligible person based on an enrollment in any proprietary
      school as an owner or an officer. If the Veteran or eligible person is an
      official authorized to sign certificates of enrollment or
      verifications/certifications of attendance, the individual cannot submit
      their own enrollment certification(s) to the VA.
    </p>
  </va-additional-info>
);

export const getCardTitle = item => {
  let title = null;

  if (item) {
    const first = item.certifyingOfficial?.first || 'Certifying';
    const last = item.certifyingOfficial?.last || 'Official';
    title = `${first} ${last}`;
  }

  return title;
};

export const getCardDescription = item => {
  return item ? (
    <>
      <p className="vads-u-margin-top--0" data-testid="card-title">
        {item.certifyingOfficial?.title || 'Title'}
      </p>
      <p data-testid="card-file-number">{item.fileNumber || 'File number'}</p>
      {item.enrollmentPeriod?.from && (
        <p data-testid="card-enrollment-period">
          {formatReviewDate(item.enrollmentPeriod.from)}
          {item.enrollmentPeriod?.to &&
            ` - ${formatReviewDate(item.enrollmentPeriod.to)}`}
        </p>
      )}
    </>
  ) : null;
};

export const allProprietaryProfitConflictsArrayOptions = {
  arrayPath: 'allProprietaryProfitConflicts',
  nounSingular: 'individual',
  nounPlural: 'individuals',
  required: false,
  text: {
    getItemName: item => getCardTitle(item),
    cardDescription: item => getCardDescription(item),
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding information',
    summaryTitle:
      'Review the individuals with a potential conflict of interest that receive VA educational benefits',
  },
};

export const proprietaryProfitConflictsArrayOptions = {
  arrayPath: 'proprietaryProfitConflicts',
  nounSingular: 'individual',
  nounPlural: 'individuals',
  required: false,
  text: {
    getItemName: item => `${item?.first || ''} ${item?.last || ''}`.trim(),
    cardDescription: item => (
      <>
        {item?.title}
        <div className=" vads-u-margin-y--2">
          {item?.individualAssociationType === 'vaEmployee'
            ? 'VA employee'
            : 'SAA employee'}
        </div>
      </>
    ),
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding information',
    summaryTitle:
      'Review the individuals with a potential conflict of interest',
    cancelAddButtonText: "Cancel adding this individual's information",
  },
};

export const alert = (
  <va-alert
    class="vads-u-margin-bottom--1"
    data-testid="info-alert"
    close-btn-aria-label="Close notification"
    disable-analytics="false"
    full-width="false"
    slim
    status="info"
    visible
  >
    <p className="vads-u-margin-y--0">
      <strong>Note:</strong> Each time the information on this form changes, a
      new submission is required.
    </p>
  </va-alert>
);

export const confirmationChildContent = (pdfUrl, trackingPrefix, goBack) => (
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

export const getTitle = role => {
  const titles = {
    certifyingOfficial: 'Certifying official',
    owner: 'Owner',
    officer: 'Officer',
  };

  let title;

  if (role.other) {
    title = role.other;
  } else {
    title = titles[role.level];
  }

  return title;
};
