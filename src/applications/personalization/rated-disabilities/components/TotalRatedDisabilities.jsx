import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from './CircularProgress';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

const TotalRatedDisabilities = props => {
  if (props.loading) {
    return (
      <LoadingIndicator message="Loading your total disability rating..." />
    );
  } else {
    return (
      <div className="feature vads-l-grid-container">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--8">
            <h3>Total combined disability</h3>
            <p>
              Your final degree of disability is {props.totalDisabilityRating}
              %. This percentage determines the amount of benefit pay you will
              receive.
            </p>
            <p>
              <a href="https://www.youtube.com/watch?v=oM7oYzL2DCg">
                Compensation 101: How did I get this rating?
              </a>
            </p>
          </div>
          <div className="vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--4">
            <CircularProgress percentage={props.totalDisabilityRating} />
          </div>
        </div>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--8">
            <h3>What if I disagree with my rating?</h3>
            <p>
              If you disagree with your rating, you can file an appeal. You'll
              need to do this within 1 year of getting your decision notice.
            </p>
            <p>
              <a href="#">Learn how to file an appeal</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default TotalRatedDisabilities;
