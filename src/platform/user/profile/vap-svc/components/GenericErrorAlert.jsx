import React from 'react';
import PropTypes from 'prop-types';

import { DEFAULT_ERROR_MESSAGE } from '../constants';

const GenericErrorAlert = ({ fieldName }) => {
  const id = `${fieldName}-error-alert`;

  return (
    <>
      <va-alert
        background-only
        class="vads-u-margin-y--1"
        close-btn-aria-label="Close notification"
        disable-analytics="false"
        status="error"
        visible="true"
        full-width
        slim
        role="alert"
        data-testid="generic-error-alert"
        tabindex="-1"
      >
        <p className="vads-u-margin-y--0" id={id}>
          {DEFAULT_ERROR_MESSAGE}
        </p>
      </va-alert>
    </>
  );
};

GenericErrorAlert.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default GenericErrorAlert;
