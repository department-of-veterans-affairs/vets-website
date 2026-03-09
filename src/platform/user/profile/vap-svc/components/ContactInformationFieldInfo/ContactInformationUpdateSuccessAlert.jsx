import React from 'react';
import PropTypes from 'prop-types';

const ContactInformationUpdateSuccessAlert = ({ fieldName }) => {
  const id = `${fieldName}-alert`;

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
        role="alert"
        data-testid="update-success-alert"
        tabindex="-1"
      >
        <p className="vads-u-margin-y--0" id={id}>
          Update saved
        </p>
      </va-alert>
    </>
  );
};

ContactInformationUpdateSuccessAlert.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default ContactInformationUpdateSuccessAlert;
