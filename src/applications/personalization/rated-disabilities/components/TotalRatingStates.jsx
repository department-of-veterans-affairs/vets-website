import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import PercetnageCalloutBox from '../components/PercentageCalloutBox';

export const errorMessage = () => {
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
  return (
    <AlertBox
      headline="Total disabilities error"
      content={message}
      status="error"
      isVisible
    />
  );
};

export const missingTotalMessage = () => {
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
  return (
    <AlertBox
      headline="No disability rating to show"
      content={message}
      status="info"
      isVisible
    />
  );
};

export const totalRatingMessage = totalDisabilityRating => (
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
            . This rating doesn't include disabilities for your claims that are
            still pending. You can check the status of your disability claims or
            appeals with the Claim Status tool.
          </p>
          <a href="/claim-or-appeal-status/">Check your claims or appeals</a>
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
