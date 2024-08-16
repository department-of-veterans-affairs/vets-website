import PropTypes from 'prop-types';

import React, { useCallback } from 'react';

const ElapsedCallTime = ({ elapsedCallTimeInSeconds }) => {
  const formatElapsedCallTime = useCallback(seconds => {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().slice(14, 19);
  }, []);

  return <span>{formatElapsedCallTime(elapsedCallTimeInSeconds)}</span>;
};

ElapsedCallTime.propTypes = {
  elapsedCallTimeInSeconds: PropTypes.number.isRequired,
};

export default ElapsedCallTime;
