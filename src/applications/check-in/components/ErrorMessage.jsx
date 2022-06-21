import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

const ErrorMessage = ({ message, additionalDetails, validationError }) => {
  const { t } = useTranslation();
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isPhoneAppointmentsEnabled } = useSelector(selectFeatureToggles);

  if (isPhoneAppointmentsEnabled && validationError) {
    return (
      <va-alert
        show-icon
        background-only
        status="error"
        data-testid="error-message"
      >
        <div>
          {t('were-sorry-we-couldnt-match-your-information-to-our-records')}
        </div>
        <div className="vads-u-margin-x--0 vads-u-margin-y--2 check-in-error-arrow">
          <strong>{t('in-person-appointment')}</strong>
        </div>
        <div>
          {validationError === 'check-in'
            ? t('check-in-with-a-staff-member')
            : t(
                'you-can-still-check-in-with-your-phone-on-the-day-of-your-appointment',
              )}
        </div>
        <div className="vads-u-margin-x--0 vads-u-margin-y--2 check-in-error-arrow">
          <strong>{t('telephone-appointment')}</strong>
        </div>
        <div>{t('your-provider-will-call-you')}</div>
      </va-alert>
    );
  }

  // determine what sub message to display
  let msg = message;
  // deprecate when telephone appointments flag is turned on
  if (validationError) {
    msg =
      validationError === 'check-in'
        ? t(
            'were-sorry-we-couldnt-match-your-information-to-our-records-please-ask-a-staff-member-for-help',
          )
        : t(
            'were-sorry-we-couldnt-match-your-information-to-our-records-please-call-us-at-800-698-2411-tty-711-for-help-signing-in',
          );
  }
  const errorMessage =
    msg ??
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
  validationError: PropTypes.string,
};

export default ErrorMessage;
