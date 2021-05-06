import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const MPIConnectionError = ({ level }) => {
  const alertMessage = (
    <p>
      We’re sorry. Something went wrong when we tried to connect to your
      records. Please refresh or try again later.
    </p>
  );

  return (
    <AlertBox
      headline="We can’t access any health care, claims, or appeals information right now"
      content={alertMessage}
      status="error"
      level={level}
    />
  );
};

MPIConnectionError.propTypes = {
  level: PropTypes.number.isRequired,
};

export default MPIConnectionError;
