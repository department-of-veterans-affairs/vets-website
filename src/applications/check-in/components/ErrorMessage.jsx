import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ErrorMessage = ({ header, message, showAlert = true }) => {
  const { t } = useTranslation();
  const errorHeader = header ?? t('we-couldnt-check-you-in');
  const errorMessage = message ?? (
    <p>
      {t(
        'were-sorry-something-went-wrong-on-our-end-check-in-with-a-staff-member',
      )}
    </p>
  );
  useEffect(() => {
    focusElement('h1');
  }, []);

  const body = (
    <>
      <h1 tabIndex="-1" slot="headline">
        {errorHeader}
      </h1>
      <div data-testid="error-message">{errorMessage}</div>
    </>
  );

  return showAlert ? <va-alert status="error">{body}</va-alert> : body;
};

ErrorMessage.propTypes = {
  header: PropTypes.string,
  message: PropTypes.node,
  showAlert: PropTypes.bool,
};

export default ErrorMessage;
