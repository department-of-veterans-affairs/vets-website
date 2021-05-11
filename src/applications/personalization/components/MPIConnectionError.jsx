import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const MPIConnectionError = ({ className, level }) => {
  const content = (
    <p>
      We’re sorry. Something went wrong when we tried to connect to your
      records. Please refresh this page or try again later.
    </p>
  );

  return (
    <div className={className}>
      <AlertBox
        headline="We can’t access your records right now"
        content={content}
        status="warning"
        level={level}
      />
    </div>
  );
};

MPIConnectionError.propTypes = {
  className: PropTypes.string,
  level: PropTypes.number.isRequired,
};

export default MPIConnectionError;
