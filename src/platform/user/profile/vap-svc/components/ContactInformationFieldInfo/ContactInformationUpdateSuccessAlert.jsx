/**
 * @module ContactInformationUpdateSuccessAlert
 * @description Success alert component displayed after successfully updating a contact information field.
 * Shows a slim green alert banner with "Update saved." message.
 *
 * @param {Object} props
 * @param {string} props.fieldName - Field name used to generate unique alert ID
 * @returns {JSX.Element} Success alert banner
 *
 * @example
 * import ContactInformationUpdateSuccessAlert from '@@vap-svc/components/ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';
 *
 * <ContactInformationUpdateSuccessAlert fieldName="mobilePhone" />
 */

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
