import React from 'react';
import PropTypes from 'prop-types';

const TOGGLE_KEY = 'view:champvaClaimsLlmValidation';

const LlmUploadAlert = ({ formContext }) => {
  if (!formContext?.data?.[TOGGLE_KEY]) return null;

  return (
    <va-alert status="info">
      To help reduce errors that might result in a claim denial, we’ll scan your
      uploads to verify they meet document requirements. This may cause a 1-2
      minute delay during the upload process. Please don’t refresh your screen.
    </va-alert>
  );
};

LlmUploadAlert.propTypes = {
  formContext: PropTypes.shape({
    data: PropTypes.shape({
      [TOGGLE_KEY]: PropTypes.bool,
    }),
  }),
};

export default LlmUploadAlert;
