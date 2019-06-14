import React from 'react';
import DisabilityRatingCalculator from '../components/DisabilityRatingCalculator';

export default class AboutDisabilityRatings extends React.Component {
  render() {
    return (
      <div>
        {/* <h1>About VA disability ratings</h1>
        <div className="va-introtext">
          <p>
            Learn about VA disability ratings and how we assign your rating. If
            you have more than one service-connected condition, use our VA
            disability rating chart (called the combined ratings table) to find
            out how we’ll determine your combined disability rating.
          </p>
        </div>
        <h3>On this page</h3>
        <ul>
          <li>
            <a href="#assign">How we assign VA disability ratings</a>
          </li>
          <li>
            <a href="#combined">
              How we determine combined VA disability ratings
            </a>
          </li>
        </ul>
        <hr />
        <h2>How we assign VA disability ratings</h2>
        <div itemScope="" itemType="http://schema.org/Question">
          <p />
          <h3 itemProp="name">What is a VA disability rating?</h3>
          <p />
          <div
            itemProp="acceptedAnswer"
            itemScope=""
            itemType="http://schema.org/Answer"
          >
            <div itemProp="text">
              <p>
                We assign you a disability rating based on the severity of your
                disability. We express this rating as a percentage, representing
                how much your disability decreases your overall health and
                ability to function.
              </p>
              <p>
                We then use your disability rating to determine your disability
                compensation rate, so we can calculate how much money you’ll
                receive from us each month. We also use your disability rating
                to help determine your eligibility for other benefits, like VA
                health care.
              </p>
            </div>
          </div>
        </div> */}
        <DisabilityRatingCalculator />
      </div>
    );
  }
}
