import React from 'react';

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
        {`${updatedText} sucessfully updated`}.
      </p>
    </va-alert>
  );
};
