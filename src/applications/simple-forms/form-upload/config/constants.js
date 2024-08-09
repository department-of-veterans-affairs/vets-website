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

export const MUST_MATCH_ALERT = (variant, onCloseEvent, formData) => {
  const isLoa3 = formData?.loa === 3;
  return (
    <VaAlert
      close-btn-aria-label="Close notification"
      status="info"
      visible
      closeable
      onCloseEvent={onCloseEvent}
    >
      {variant === 'name-and-zip-code' ? (
        <h2 slot="headline">Name and zip code must match your form</h2>
      ) : (
        <h2 slot="headline">Identification information must match your form</h2>
      )}
      {isLoa3 ? (
        <p>
          Since you’re signed in to your account, we prefilled part of your
          application based on your account details.
        </p>
      ) : null}
      {variant === 'name-and-zip-code' ? (
        <p>
          If your name and zip code here don’t match your form, it will cause
          processing delays.
        </p>
      ) : (
        <p>
          If the identification information you enter here don’t match your
          form, it will cause processing delays.
        </p>
      )}
    </VaAlert>
  );
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
  'Personal information;File upload;Submit your form';

export const SUBTITLE_0779 =
  'Request for Nursing Home Information in Connection with Claim for Aid and Attendance';

export const DOWNLOAD_URL_0779 =
  'https://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf';

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

export const ALERT_WRONG_FORM = (formNumber, pdfDownloadUrl, onCloseEvent) =>
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
          The file you uploaded doesn’t look like a recent VA Form {formNumber}.
          Please make sure you’re using the most recent form.
        </p>
        <a href={pdfDownloadUrl}>
          Download VA Form {formNumber}
          (PDF)
        </a>
        <p>If you’re sure this is the right file, you can continue.</p>
      </React.Fragment>
    </VaAlert>,
  );
