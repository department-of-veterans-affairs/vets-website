import React from 'react';
import PropTypes from 'prop-types';

const MPIConnectionError = ({ className }) => {
  return (
    <va-alert
      class={className}
      status="warning"
      data-testid="mpi-connection-error"
      uswds
    >
      <h2 slot="headline">We can’t access your records right now</h2>
      <p className="vads-u-margin-bottom--0">
        We’re sorry. Something went wrong when we tried to connect to your
        records. Please refresh this page or try again later.
      </p>
    </va-alert>
  );
};

MPIConnectionError.propTypes = {
  className: PropTypes.string,
};

export default MPIConnectionError;
