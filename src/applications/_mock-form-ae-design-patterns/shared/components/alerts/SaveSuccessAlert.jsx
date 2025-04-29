import React from 'react';
import PropTypes from 'prop-types';

export const SaveSuccessAlert = ({ updatedText = 'information' }) => {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="success"
      visible
      slim
      class="vads-u-margin-bottom--2"
    >
      <p className="vads-u-margin-y--0">
        {`${updatedText} sucessfully updated in this form`}.
      </p>
    </va-alert>
  );
};

SaveSuccessAlert.propTypes = {
  updatedText: PropTypes.string,
};
