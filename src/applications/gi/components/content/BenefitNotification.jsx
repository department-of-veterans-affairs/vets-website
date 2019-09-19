import React from 'react';
import environment from 'platform/utilities/environment';

export const BenefitNotification = () => {
  // prod flag for story 19656
  if (environment.isProduction())
    return (
      <div className="benefit-notification">
        <span className="usa-label">New</span>
        <div className="feature">
          <h4>The Edith Nourse Rogers STEM Scholarship</h4>
          <p>
            On August 1, 2019, VA launched the Edith Nourse Rogers STEM
            Scholarship for students enrolled in a high-demand STEM (Science,
            Technology, Engineering, and Math) program.
          </p>
          <p>
            To learn more about this scholarship,{' '}
            <a
              href="https://benefits.va.gov/gibill/fgib/stem.asp"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              visit the Edith Nourse Rogers STEM Scholarship website
            </a>
            .
          </p>
        </div>
      </div>
    );
  return (
    <div className="benefit-notification">
      <span className="usa-label">New</span>
      <div className="feature">
        <h4>Attending classes at an extension campus?</h4>
        <p>
          Under the Forever GI Bill, the Monthly Housing Allowance (MHA) is
          calculated based on the campus location where you physically attend
          the majority of your classes.
        </p>
        <p>
          To estimate your MHA benefit, you can go to a school or employer's
          profile page in the GI Bill Comparison Tool and answer the question
          "Where will you take the majority of your classes?"
        </p>
        <p>
          To learn more about the Location-Based Housing Allowance,{' '}
          <a
            href="https://va.gov/education/about-gi-bill-benefits/post-9-11/#location-based107"
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
};

export default BenefitNotification;
