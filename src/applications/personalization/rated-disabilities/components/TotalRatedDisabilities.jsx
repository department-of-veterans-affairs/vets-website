import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import PercetnageCalloutBox from '../components/PercentageCalloutBox';

const TotalRatedDisabilities = props => {
  const { loading, totalDisabilityRating, error } = props;
  let content;
  // If the data from the parent is loading ( loading prop ), show a loading indicator
  // If there is an error, display an error message,
  // If there is no rating, display a no rating message
  // If there is a rating, display the rating and content
  if (loading) {
    content = (
      <LoadingIndicator message="Loading your total disability rating..." />
    );
  } else if (error) {
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
  } else if (!totalDisabilityRating) {
    const message = (
      <span>
        <p>We don't have a disability rating for you in our system.</p>
        <h4>Want to add disabilities?</h4>
        <p>
          If you believe you have disabilities related to your military service,
          you can submit a claim to update your disability rating.
        </p>
        <a href="#" className="usa-link">
          Submit a new claim
        </a>
      </span>
    );
    content = (
      <AlertBox
        headline="No disability rating to show"
        content={message}
        status="info"
        isVisible
      />
    );
  } else {
    content = (
      <span>
        <div className="total-rated-disabilities">
          <div className="vads-l-row">
            <div className="vads-l-col--12">
              <h1>Your disability rating</h1>
            </div>
          </div>
          <div className="vads-l-row medium-screen:vads-u-padding-bottom--2p5">
            <div className="vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--9 vads-u-padding-right--1p5">
              <p>
                <strong>
                  Your combined disability rating is {totalDisabilityRating}%
                </strong>
                . This rating doesn't include disabilities for your claims that
                are still pending. You can check the status of your disability
                claims or appeals with the Claim Status tool.
              </p>
              <a href="/claim-or-appeal-status/">
                Check your claims or appeals
              </a>
            </div>
            <div className="vads-u-margin-top--2p5 medium-screen:vads-u-margin-top--0 vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--3 medium-screen:vads-u-padding-top--2p5">
              <PercetnageCalloutBox
                value={totalDisabilityRating}
                isPercentage
                label="Your combined VA disability rating"
              />
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
