import React from 'react';

export const HelpfulLinks = () => (
  <div>
    <p>
      <a href="/education/tools-programs/careerscope" target="_blank">
        Explore your career
      </a>
    </p>
    <p>
      <a href="http://www.benefits.va.gov/gibill/choosing_a_school.asp" target="_blank">
        Choose a school guide
      </a>
    </p>
    <p>
      <a href="/education/apply" target="_blank">
        Apply for education benefits
      </a>
    </p>
  </div>
);

const AdditionalResources = () => (
  <div className="additional-resources medium-4 small-12 column">
    <h4 className="highlight">Additional Resources</h4>
    <HelpfulLinks/>
  </div>
);

export default AdditionalResources;
