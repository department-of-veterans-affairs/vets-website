import React from 'react';
import PropTypes from 'prop-types';

function UploadWarningComponent({ formContext }) {
  if (!formContext?.data?.['view:champvaClaimsLlmValidation']) return <></>;

  return (
    <va-alert status="info">
      To help reduce errors that might result in a claim denial, we’ll scan your
      uploads to verify they meet document requirements. This may cause a 1-2
      minute delay during the upload process. Please don’t refresh your screen.
    </va-alert>
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
  formContext: PropTypes.object,
};
