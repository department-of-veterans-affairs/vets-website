import React from 'react';
import CallToActionWidget from 'platform/site-wide/cta-widget';

const RatedDisabilityLoginView = ({ isLoading }) => (
  <div>
    {!isLoading ? (
      <header>
        <h2>Your disability rating</h2>
        <p>
          If you got a decision from us that confirms your disability rating,
          you may be able to get disability compensation or benefits. Review
          your rating and find out what benefits you can get.
        </p>
      </header>
    ) : null}
    <CallToActionWidget appId="rated-disabilities" />
    {!isLoading ? (
      <>
        <div>
          <h2>What is a disability rating?</h2>
          <p>
            We assign you a disability rating based on the severity of your
            disability. We express this rating as a percentage, representing how
            much your disability decreases your overall health and ability to
            function.
          </p>
          <p>
            We then use your disability rating to determine your disability
            compensation rate, so we can calculate how much money you'll receive
            from us each month. We also use your disability rating to determine
            your eligibility for other benefits, like VA healthcare. Learned how
            VA disability ratings are assigned at About VA disability ratings.
          </p>
        </div>
        <div>
          <h2>What if I have more questions?</h2>
          <p>
            Watch our videos to learn more about how VA disability ratings and
            compensation work:
          </p>
          <a>Compensation 101: How did I get this rating? (Youtube)</a>
          <a>Compensation 101: What is disability compensation? (Youtube)</a>
          <a>Compensation 101: What is service? (Youtube)</a>
        </div>
        <p>
          If you need help understanding your benefits or accessing services,
          please call us at 877-827-1000. We're here Monday through Friday,
          8:00a.m. to 9:00p.m. ET.
        </p>
      </>
    ) : null}
  </div>
);

export default RatedDisabilityLoginView;
