import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const CheckInButton = ({ onClick }) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { t } = useTranslation();
  const handleClick = useCallback(
    () => {
      setIsCheckingIn(true);
      onClick();
    },
    [onClick],
  );
  return (
    <button
      type="button"
      className="usa-button usa-button-big vads-u-font-size--md"
      onClick={handleClick}
      data-testid="check-in-button"
      disabled={isCheckingIn}
      aria-label={t('check-in-now-for-your-appointment')}
    >
      {isCheckingIn ? (
        <span role="status">{t('loading')}</span>
      ) : (
        <>{t('check-in-now')}</>
      )}
    </button>
  );
};

CheckInButton.propTypes = {
  onClick: PropTypes.func,
};

export { CheckInButton };
