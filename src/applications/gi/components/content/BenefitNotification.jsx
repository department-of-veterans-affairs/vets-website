import React from 'react';

export const BenefitNotification = () => (
  <div className="benefit-notification">
    <span className="usa-label">New</span>
    <div className="feature">
      <h4>Attending classes at an extension campus?</h4>
      <p>
        Under the Forever GI Bill, the Monthly Housing Allowance (MHA) is
        calculated based on the campus location where you physically attend the
        majority of your classes.
      </p>
      <p>
        To estimate your MHA benefit, you can go to a school or employer's
        profile page in the GI Bill Comparison Tool and answer the question
        "Where will you take the majority of your classes?"
      </p>
      <p>
        To learn more about the Location-Based Housing Allowance,{' '}
        <a
          href="https://va.gov/education/about-gi-bill-benefits/post-9-11/#what-is-the-location-based-hou"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          visit the Post-9/11 GI Bill website
        </a>
        .
      </p>
    </div>
  </div>
);

export default BenefitNotification;
