import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from './CircularProgress';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

const TotalRatedDisabilities = props => {
  let content;
  // If the data from the parent is loading, show a loading indicator
  // If there is an error, display an error message,
  // If there is no rating, display a no rating message
  // If there is a rating, display the rating and content
  if (props.loading) {
    content = (
      <LoadingIndicator message="Loading your total disability rating..." />
    );
  } else if (props.error) {
    const message = (
      <span>
        <p>
          We're sorry. An error occurred when accessing your disability rating
          information.
        </p>
        <h4>What you can do</h4>
        <p>
          Sign out of VA.gov, then log back in to try this page again. If the
          error continues, please call the VA.gov Help Desk at 1-855-574-7286
          (TTY:1-800-829-4833). We're here Monday-Friday, 8:00 a.m. - 8:00 p.m.
          (ET).
        </p>
      </span>
    );
    content = (
      <AlertBox
        headline="Total disabilities error"
        content={message}
        status="error"
        isVisible
      />
    );
  } else if (!props.totalDisabilityRating) {
    const message = (
      <span>
        <p>
          We sorry. We can't find a disability rating matched with the name,
          date of birth, and social secuity number you provided in our Veteran
          records.
        </p>
        <h4>What you can do</h4>
        <p>
          If you feel your information is correct, please call the VA.gov
          1-855-574-7286. We're here Monday through Friday, 8:00 a.m. to 8:00
          p.m. (ET).
        </p>
      </span>
    );
    content = (
      <AlertBox
        headline="No total disabilities information"
        content={message}
        status="info"
        isVisible
      />
    );
  } else {
    content = (
      <span>
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
      </span>
    );
  }

  return <span>{content}</span>;
};

TotalRatedDisabilities.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  totalDisabilityRating: PropTypes.number,
};

export default TotalRatedDisabilities;
