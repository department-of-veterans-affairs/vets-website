import React from 'react';
import PropTypes from 'prop-types';
import '../sass/total-rated-disabilities.scss';

const CircularProgress = props => {
  const { percentage } = props;

  const offsetValue = 100 - percentage;

  return (
    <div className="chart-box">
      <svg viewBox="0 0 42 42" className="donut">
        <circle className="donut-hole" cx="21" cy="21" r="16" />
        <circle className="donut-ring" cx="21" cy="21" r="16" />
        <circle
          className="donut-data"
          cx="21"
          cy="21"
          r="16"
          strokeDasharray={percentage + ' ' + offsetValue}
        />
      </svg>
      <div className="disability-rating vads-u-font-family--sans vads-u-font-size--2xl">
        {percentage}%
      </div>
    </div>
  );
};

CircularProgress.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default CircularProgress;
