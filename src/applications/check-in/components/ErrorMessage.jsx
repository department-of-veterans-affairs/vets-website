import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ErrorMessage = ({ message, additionalDetails }) => {
  const { t } = useTranslation();
  const errorMessage =
    message ??
    t(
      'were-sorry-something-went-wrong-on-our-end-check-in-with-a-staff-member',
    );

  const subMessage =
    errorMessage.length === 0 ? (
      ''
    ) : (
      <va-alert background-only show-icon data-testid="error-message">
        <div>{errorMessage}</div>
      </va-alert>
    );

  return (
    <>
      {subMessage}
      {additionalDetails && (
        <div className="vads-u-margin-top--3">{additionalDetails}</div>
      )}
    </>
  );
};

ErrorMessage.propTypes = {
  additionalDetails: PropTypes.node,
  header: PropTypes.string,
  message: PropTypes.node,
};

export default ErrorMessage;
