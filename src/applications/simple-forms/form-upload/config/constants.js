import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const PrimaryActionLink = ({ href, children, onClick }) => (
  <div className="action-bar-arrow">
    <div className="vads-u-background-color--primary vads-u-padding--1">
      <a className="vads-c-action-link--white" href={href} onClick={onClick}>
        {children}
      </a>
    </div>
  </div>
);
PrimaryActionLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
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
        <h3 slot="headline">
          Veteran’s name and postal code must match your PDF
        </h3>
      ) : (
        <h3 slot="headline">
          Veteran’s identification information must match your PDF
        </h3>
      )}
      {isLoa3 ? (
        <p>
          Since you’re signed in to your account, we prefilled part of your
          application based on your account details.
        </p>
      ) : null}
      {variant === 'name-and-zip-code' ? (
        <p>
          If the Veteran’s name and postal code here don’t match your uploaded
          PDF, it will cause processing delays.
        </p>
      ) : (
        <p>
          If the Veteran’s identification information you enter here doesn’t
          match your uploaded PDF, it will cause processing delays.
        </p>
      )}
    </VaAlert>
  );
};

export const UPLOAD_TITLE = 'Your file';

export const SUPPORTING_DOCUMENTS =
  'We may need additional documents to support your claim or application. Submitting them now will help us process your form faster. If you’re not ready to submit your supporting documents, you can send them to us later. But that means it may take us longer to make a decision.';

export const UPLOAD_FORM_DESCRIPTION = Object.freeze(
  <p>
    <span className="vads-u-font-weight--bold">Note:</span> To save your files,
    you must submit this form in the same session. If you leave without
    submitting, you will need to upload your files again.
  </p>,
);

export const UPLOAD_SUPPORTING_DOCUMENTS_DESCRIPTION = Object.freeze(
  <>
    <p>
      Upload your supporting documents from the same device you’re using to
      submit your form.{' '}
    </p>
    <p>
      <span className="vads-u-font-weight--bold">Note:</span> To submit your
      documents here, upload them when you’re ready to submit your form. We
      can’t save documents for later. If you need more time to gather your
      documents, follow the instructions on your form for how to submit them.
    </p>
    <va-additional-info trigger="How to determine what supporting documents to upload">
      <p>
        {' '}
        To figure out which documents to upload, review the guidance we’ve given
        you. This may be in:
      </p>
      <ul>
        <li>Instructions on the paper form you filled out</li>
        <li>Development letters we’ve sent you</li>
        <li>Other guidance provided by VA</li>
      </ul>
    </va-additional-info>
  </>,
);

export const UPLOAD_SUPPORTING_DOCUMENTS = 'Upload Supporting Documents';

export const getTitleByForm = formNumber =>
  `Supporting Documents for VA Form ${formNumber}`;

export const SAVE_IN_PROGRESS_CONFIG = {
  messages: {
    inProgress: 'Your form upload is in progress.',
    expired:
      'Your form upload has expired. If you want to upload a form, please start a new request.',
    saved: 'Your form upload has been saved.',
  },
};

export const FORM_UPLOAD_OCR_ALERT = (
  formNumber,
  pdfDownloadUrl,
  onCloseEvent,
  warnings = [],
) => (
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
      <ul>
        {warnings.includes('too_many_pages') && (
          <li>
            The file you uploaded has more pages than the form usually has.
          </li>
        )}
        {warnings.includes('too_few_pages') && (
          <li>The file you uploaded has fewer pages than the original form.</li>
        )}
        {warnings.includes('wrong_form') && (
          <li>
            The file you uploaded doesn’t look like a recent VA Form{' '}
            {formNumber}.
          </li>
        )}
      </ul>
      <p className="vads-u-margin-y--0">
        Please check the file you uploaded is a recent VA Form {formNumber}.
      </p>
      <a href={pdfDownloadUrl}>
        Download VA Form {formNumber}
        (PDF)
      </a>
      <p>If you’re sure this is the right file, you can continue.</p>
    </React.Fragment>
  </VaAlert>
);

export const FORM_UPLOAD_INSTRUCTION_ALERT = onCloseEvent => (
  <VaAlert
    close-btn-aria-label="Close notification"
    status="warning"
    visible
    closeable
    onCloseEvent={onCloseEvent}
  >
    <h2 slot="headline">Complete and sign your form before you upload</h2>
    <React.Fragment key=".1">
      <p>
        If you upload a form that’s missing a signature or any other required
        information, we won’t be able to process it.
      </p>
    </React.Fragment>
  </VaAlert>
);

export const FORM_UPLOAD_FILE_UPLOADING_ALERT = onCloseEvent => (
  <VaAlert
    close-btn-aria-label="Close notification"
    status="error"
    visible
    closeable
    slim
    onCloseEvent={onCloseEvent}
  >
    File upload must be complete to continue.
  </VaAlert>
);
export const FILE_UPLOAD_URL = `${
  environment.API_URL
}/simple_forms_api/v1/scanned_form_upload`;

export const MAX_FILE_SIZE = 25000000;
