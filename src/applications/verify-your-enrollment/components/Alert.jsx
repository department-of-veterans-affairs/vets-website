import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ status, title, message, id }) => {
  return (
    <div className="vads-u-margin-y--2" id={id}>
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
  id: PropTypes.string,
  message: PropTypes.string,
  status: PropTypes.string,
  title: PropTypes.string,
};

export default Alert;
