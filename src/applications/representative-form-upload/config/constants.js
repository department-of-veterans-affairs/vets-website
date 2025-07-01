import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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

export const UPLOAD_DESCRIPTION = Object.freeze(
  <>
    <span className="vads-u-font-weight--bold">Note:</span> After you upload
    your file, you’ll need to continue to the next screen to submit it. If you
    leave before you submit it, you’ll need to upload it again.
  </>,
);

export const FORM_UPLOAD_OCR_ALERT = (
  formNumber,
  onCloseEvent,
  warnings = [],
) => (
  <VaAlert
    close-btn-aria-label="Close notification"
    status="error"
    visible
    closeable
    onCloseEvent={onCloseEvent}
  >
    <h2 slot="headline">
      Are you sure the file you uploaded is VA Form {formNumber}?
    </h2>
    {warnings.includes('too_many_pages') && (
      <p>The file you uploaded has more pages than the form usually has.</p>
    )}
    {warnings.includes('too_few_pages') && (
      <p>The file you uploaded has fewer pages than the original form.</p>
    )}
    {warnings.includes('wrong_form') && (
      <p>
        The file you uploaded doesn’t look like VA Form {formNumber}. Check to
        make sure the file uploaded is the official VA form
      </p>
    )}

    <p className="arp-alert-right-file-p">
      If you’re sure this is the right file, you can continue.
    </p>
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
