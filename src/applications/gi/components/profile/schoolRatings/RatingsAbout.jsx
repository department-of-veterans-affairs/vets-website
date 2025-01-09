import React from 'react';

const RatingsAbout = () => {
  return (
    <div className="vads-u-padding-top--4 about-ratings">
      <div className="mobile-lg:vads-u-font-size--h3 vads-u-padding-bottom--1p5 vads-u-font-weight--bold vads-u-font-family--serif small-screen-font">
        About ratings
      </div>
      <hr className="vads-u-margin-top--neg1px" />
      <p>
        We ask Veterans who have used their education benefits to rate schools
        they’ve attended on a scale of 1 to 4 stars, with 4 stars being the best
        rating.
      </p>
      <span className="mobile-lg:vads-u-font-size--h4 vads-u-font-weight--bold small-screen-font">
        How ratings are collected
      </span>
      <p>
        VA works independently to collect ratings from Veterans. We reach out to
        Veterans to provide a rating who have:
      </p>
      <ul>
        <li>Received a Certificate of Eligibility (COE) for benefits</li>
        <li>Transferred into or out of a school</li>
        <li>
          Made a change to their program of study, <strong>or</strong>
        </li>
        <li>Completed their degree program</li>
      </ul>
      <p>
        Veterans rate schools on a number of categories. Those ratings are
        averaged to calculate the overall school rating. If a Veteran doesn’t
        rate a category, it has no effect on the category’s overall score.
      </p>
      <span className="vads-u-font-size--h4 vads-u-font-weight--bold">
        Veteran privacy
      </span>
      <p>
        A school may ask us for a list of Veterans who rated their school, but
        we do not share individual ratings with schools. If an institution asks
        us for information on who rated their school, no information beyond what
        is publicly available on the Comparison Tool is shared with them that
        would tie an individual to their ratings.
      </p>
    </div>
  );
};

export default RatingsAbout;
