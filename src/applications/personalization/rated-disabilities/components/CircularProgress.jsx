import React from 'react';
import PropTypes from 'prop-types';
import '../sass/circular-progress.scss';

const CircularProgress = props => {
  // numbers used to set the stroke-dasharray, the props.percentage passed in translates to the percentage of the progress bar filled
  const { percentage } = props;
  const offsetValue = 100 - percentage;
  const dashArray = `${percentage} ${offsetValue}`;

  return (
    <div className="circular-progress">
      <svg viewBox="0 0 42 42" className="circle">
        <circle className="center" cx="21" cy="21" r="16" />
        <circle className="empty" cx="21" cy="21" r="16" />
        <circle
          className="fill"
          cx="21"
          cy="21"
          r="16"
          strokeDasharray={dashArray}
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
