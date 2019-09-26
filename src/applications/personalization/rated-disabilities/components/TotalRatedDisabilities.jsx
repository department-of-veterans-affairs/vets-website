import React from 'react';
import PropTypes from 'prop-types';
import '../sass/total-rated-disabilities.scss';
import CircularProgress from './CircularProgress';

const TotalRatedDisabilities = props => {
  return (
    <div className="feature">
      <div className="vads-u-display--flex">
        <div className="vads-u-flex--3">
          <h3>Total combined disability</h3>

          <p>
            Your final degree of disability is {props.percentage}
            %. This percentage determines the amount of benefit pay you will
            receive.
          </p>

          <p>
            <a href="https://www.youtube.com/watch?v=oM7oYzL2DCg">
              Compensation 101: How did I get this rating?
            </a>
          </p>

          <h3>What if I disagree with my rating?</h3>

          <p>
            If you disagree with your rating, you can file an appeal. You'll
            need to do this within 1 year of getting your decision notice.
          </p>

          <p>
            <a href="#">Learn how to file an appeal</a>
          </p>
        </div>
        <div className="vads-u-flex--1">
          <CircularProgress percentage={props.percentage} />
        </div>
      </div>
    </div>
  );
};

TotalRatedDisabilities.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default TotalRatedDisabilities;
