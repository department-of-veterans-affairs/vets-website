import React from 'react';
import PropTypes from 'prop-types';

const NotInMPIError = ({ className }) => {
  return (
    <div className={className} data-testid="not-in-mpi">
      <va-alert status="warning" uswds>
        <h2 slot="headline">
          We can’t match your information with our Veteran records
        </h2>
        <p className="vads-u-margin-bottom--0">
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
