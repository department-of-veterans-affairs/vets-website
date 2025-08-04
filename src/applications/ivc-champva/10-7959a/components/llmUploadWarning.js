import React from 'react';
import PropTypes from 'prop-types';

// Extract the component to define PropTypes properly
function UploadWarningComponent({ formContext }) {
  // Early return if feature toggle is disabled
  if (!formContext?.data?.champvaClaimsLlmValidation) return <></>;

  return (
    <>
      <a
        href="https://www.va.gov/resources/how-to-file-a-champva-claim/"
        rel="noopener noreferrer"
      >
        Learn more about supporting medical claim documents (opens in a new tab)
      </a>
      <br />
      <br />
      <va-alert status="info">
        To help reduce errors that might result in a claim denial, we'll scan
        your uploads to verify they meet document requirements. This may cause a
        1-2 minute delay during the upload process. Please don't refresh your
        screen.
      </va-alert>
    </>
  );
}

// Alert markup to display on pages where LLM upload monitoring is active
export const LLM_UPLOAD_WARNING = {
  'view:fileClaim': {
    'ui:description': UploadWarningComponent,
  },
};

// Define PropTypes on the component itself
UploadWarningComponent.propTypes = {
  _formData: PropTypes.object,
  formContext: PropTypes.object,
};
