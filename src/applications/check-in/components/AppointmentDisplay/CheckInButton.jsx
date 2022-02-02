import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const CheckInButton = ({ onClick }) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
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
      aria-label="Check in now for your appointment"
    >
      {isCheckingIn ? <span role="status">Loading...</span> : <>Check in now</>}
    </button>
  );
};

CheckInButton.propTypes = {
  onClick: PropTypes.func,
};

export { CheckInButton };
