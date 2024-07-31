import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const PrimaryActionLink = ({ href = '/', children, onClick = null }) => (
  <div className="action-bar-arrow">
    <div className="vads-u-background-color--primary vads-u-padding--1">
      <a className="vads-c-action-link--white" href={href} onClick={onClick}>
        {children}
      </a>
    </div>
  </div>
);
PrimaryActionLink.propTypes = {
  children: PropTypes.element.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
};

export const UPLOAD_GUIDELINES = Object.freeze(
  <>
    <h3 className="vads-u-margin-bottom--3">Upload your file</h3>
    <p className="vads-u-margin-top--0">
      You’ll need to scan your document onto the device you’re using to submit
      this application, such as your computer, tablet, or mobile phone. You can
      upload your document from there.
    </p>
    <div>
      <p>Guidelines for uploading a file:</p>
      <ul>
        <li>You can upload a .pdf, .jpeg, or .png file</li>
        <li>Your file should be no larger than 25MB</li>
      </ul>
    </div>
  </>,
);

export const SAVE_IN_PROGRESS_CONFIG = {
  messages: {
    inProgress: 'Your form upload is in progress.',
    expired:
      'Your form upload has expired. If you want to upload a form, please start a new request.',
    saved: 'Your form upload has been saved.',
  },
};

export const PROGRESS_BAR_LABELS =
  'Upload your file;Review your information;Submit your form';

export const SUBTITLE_0779 =
  'Request for Nursing Home Information in Connection with Claim for Aid and Attendance';

export const DOWNLOAD_URL_0779 =
  'https://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf';

export const CHILD_CONTENT_0779 = Object.freeze(
  <>
    <div>
      <p>
        <span className="vads-u-font-weight--bold">Related to:</span> Disability
        <br />
        <span className="vads-u-font-weight--bold">
          Form last updated:
        </span>{' '}
        October 2023
      </p>
    </div>
    <h2>When to use this form</h2>
    <p>
      Use VA Form 21-0779 if you’re a resident of a nursing home and you’re
      providing supporting information for your claim application for VA Aid and
      Attendance benefits.
    </p>
    <h3>Download form</h3>
    <p>
      Download this PDF form and fill it out. Then submit your completed form on
      this page. Or you can print the form and mail it to the address listed on
      the form.
    </p>
    <div className="vads-u-margin-y--4">
      <va-link
        download
        href="https://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf"
        text="Download VA Form 21-0779"
      />
    </div>
    <h3>Submit completed form</h3>
    <p>After you complete the form, you can upload and submit it here.</p>
  </>,
);

export const ADD_CHILD_CONTENT_0779 = Object.freeze(
  <>
    <h2>Related forms and instructions</h2>
    <h3>
      <div className="vads-u-margin-y--4">
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-2680/"
          text="VA Form 21-2680"
        />
      </div>
    </h3>
    <p>
      Examination for Housebound Status or Permanent Need for Regular Aid and
      Attendance
    </p>
    <p>
      Use VA Form 21-2680 to apply for Aid and Attendance benefits that will be
      added to your monthly compensation or pension benefits.
    </p>
    <div className="vads-u-margin-y--4">
      <va-link
        download
        href="https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf"
        text="Download VA Form 21-2680"
      />
    </div>
    <div
      className="vads-u-display--none medium-screen:vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-background-color--gray-light-alt vads-u-margin-top--2p5 vads-u-margin-bottom--4"
      data-e2e-id="yellow-ribbon--helpful-links"
    >
      <h3 className="vads-u-margin--0 vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-light">
        Helpful links related to VA Form 21-0779
      </h3>
      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
        <a href="https://www.va.gov/pension/aid-attendance-housebound/">
          VA Aid and Attendance benefits and Housebound allowance
        </a>
      </p>
      <p className="vads-u-margin-top--0">
        If you need help with daily activities, or you’re housebound, learn
        about these benefits and if you qualify.
      </p>
    </div>
  </>,
);

export const ALERT_TOO_MANY_PAGES = (
  formNumber,
  pdfDownloadUrl,
  onCloseEvent,
) =>
  Object.freeze(
    <VaAlert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
      closeable
      onCloseEvent={onCloseEvent}
    >
      <h2 slot="headline">
        Are you sure the file you uploaded is VA Form {formNumber}?
      </h2>
      <React.Fragment key=".1">
        <p className="vads-u-margin-y--0">
          The file you uploaded has more pages than the form usually has. Please
          check the file you uploaded is a recent VA Form {formNumber}.
        </p>
        <a href={pdfDownloadUrl}>
          Download VA Form {formNumber}
          (PDF)
        </a>
        <p>If you’re sure this is the right file, you can continue.</p>
      </React.Fragment>
    </VaAlert>,
  );

export const ALERT_TOO_FEW_PAGES = (formNumber, pdfDownloadUrl, onCloseEvent) =>
  Object.freeze(
    <VaAlert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
      closeable
      onCloseEvent={onCloseEvent}
    >
      <h2 slot="headline">
        Are you sure the file you uploaded is VA Form {formNumber}?
      </h2>
      <React.Fragment key=".1">
        <p className="vads-u-margin-y--0">
          The file you uploaded has fewer pages than the original form. Please
          check your uploaded form to be sure it is the correct form.
        </p>
        <a href={pdfDownloadUrl}>
          Download VA Form {formNumber}
          (PDF)
        </a>
        <p>If you’re sure this is the right file, you can continue.</p>
      </React.Fragment>
    </VaAlert>,
  );
