import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

const Alert = ({ status, title, message }) => {
  const dispatch = useDispatch();

  // This Effcet to reset errors or response after 15s
  useEffect(
    () => {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESET_ERROR' });
        dispatch({ type: 'RESET_SUCCESS_MESSAGE' });
        dispatch({ type: 'RESET_ADDRESS_VALIDATIONS_ERROR' });
      }, 15000);
      return () => clearTimeout(timer);
    },
    [dispatch],
  );

  return (
    <div className="vads-u-margin-y--2">
      <va-alert
        close-btn-aria-label="Close notification"
        status={status}
        uswds
        visible
      >
        <React.Fragment key=".1">
          {title && <h2 slot="headline">{title}</h2>}
          <p data-testid="alert" className="vads-u-margin-y--0">
            {message}
          </p>
        </React.Fragment>
      </va-alert>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  status: PropTypes.string,
  title: PropTypes.string,
};

export default Alert;
