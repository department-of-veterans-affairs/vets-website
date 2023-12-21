import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

const ContactInformationUpdateSuccessAlert = ({ fieldName }) => {
  const id = `${fieldName}-alert`;

  useEffect(
    () => {
      const editButton = document
        .querySelector(`[data-field-name=${fieldName}]`)
        ?.querySelector("[data-action='edit']");
      if (editButton) {
        focusElement(editButton);
      }
    },

    [fieldName, id],
  );

  return (
    <>
      <va-alert
        background-only
        class="vads-u-margin-y--1"
        close-btn-aria-label="Close notification"
        disable-analytics="false"
        show-icon
        status="success"
        visible="true"
      >
        <div
          className="vads-u-display--flex vads-u-margin-left--neg1p5"
          id={id}
        >
          <p className="vads-u-margin-y--0" role="alert" aria-live="polite">
            'Update saved.'
          </p>
        </div>
      </va-alert>
    </>
  );
};

ContactInformationUpdateSuccessAlert.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default ContactInformationUpdateSuccessAlert;
