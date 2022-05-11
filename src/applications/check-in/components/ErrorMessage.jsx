import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ErrorMessage = ({ header, message, messageBox = false }) => {
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

  const messageElement = messageBox ? (
    <va-alert background-only show-icon data-testid="error-message">
      {errorMessage}
    </va-alert>
  ) : (
    <div data-testid="error-message">{errorMessage}</div>
  );

  return (
    <>
      <h1 tabIndex="-1" slot="headline">
        {errorHeader}
      </h1>
      {messageElement}
    </>
  );
};

ErrorMessage.propTypes = {
  header: PropTypes.string,
  message: PropTypes.node,
  messageBox: PropTypes.bool,
};

export default ErrorMessage;
