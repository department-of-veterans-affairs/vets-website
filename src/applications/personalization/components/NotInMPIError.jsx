import React from 'react';
import PropTypes from 'prop-types';

const NotInMPIError = ({ className }) => {
  return (
    <div className={className}>
      <va-alert status="warning">
        <h2 slot="headline">
          We can’t match your information with our Veteran records
        </h2>
        <p>
          You may not be able to use some tools and features right now. But
          we’re working to connect with your records. Try again soon.
        </p>
      </va-alert>
    </div>
  );
};

NotInMPIError.propTypes = {
  className: PropTypes.string,
};

export default NotInMPIError;
