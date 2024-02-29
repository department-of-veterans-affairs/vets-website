import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

const Alert = ({ status, message }) => {
  const dispatch = useDispatch();
  useEffect(
    () => {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESET_ERROR' });
        dispatch({ type: 'RESET_SUCCESS_MESSAGE' });
      }, 15000);
      return () => clearTimeout(timer);
    },
    [dispatch],
  );

  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status={status}
      uswds
      visible
    >
      <React.Fragment key=".1">
        <p data-testid="alert" className="vads-u-margin-y--0">
          {message}
        </p>
      </React.Fragment>
    </va-alert>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  status: PropTypes.string,
};

export default Alert;
