import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ErrorMessage = ({ message, additionalDetails, validationError }) => {
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

  return validationError ? (
    <va-alert
      show-icon
      background-only
      status="error"
      data-testid="error-message"
    >
      <div>
        {t('were-sorry-we-couldnt-match-your-information-to-our-records')}
      </div>
      <div className="check-in-error-arrow">
        <strong>{t('in-person-appointment')}</strong>
      </div>
      <div>
        {validationError === 'check-in'
          ? t('check-in-with-a-staff-member')
          : t(
              'you-can-still-check-in-with-your-phone-on-the-day-of-your-appointment',
            )}
      </div>
      <div className="check-in-error-arrow">
        <strong>{t('telephone-appointment')}</strong>
      </div>
      <div>{t('your-provider-will-call-you')}</div>
    </va-alert>
  ) : (
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
  validationError: PropTypes.string,
};

export default ErrorMessage;
