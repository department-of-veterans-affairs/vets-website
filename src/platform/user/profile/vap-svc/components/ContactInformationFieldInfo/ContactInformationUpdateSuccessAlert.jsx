import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { waitForRenderThenFocus } from 'platform/utilities/ui';

const ContactInformationUpdateSuccessAlert = ({ fieldName }) => {
  const id = `${fieldName}-alert`;

  useEffect(
    () => {
      if (fieldName) {
        // Focus on the va-alert element itself
        waitForRenderThenFocus(
          `[data-field-name=${fieldName}] va-alert`,
          document,
          50,
        );
      }
    },
    [fieldName],
  );

  return (
    <>
      <va-alert
        background-only
        class="vads-u-margin-y--1"
        close-btn-aria-label="Close notification"
        disable-analytics="false"
        status="success"
        visible="true"
        full-width
        slim
        uswds
        role="alert"
        data-testid="update-success-alert"
      >
        <p className="vads-u-margin-y--0" id={id}>
          Update saved.
        </p>
      </va-alert>
    </>
  );
};

ContactInformationUpdateSuccessAlert.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default ContactInformationUpdateSuccessAlert;
