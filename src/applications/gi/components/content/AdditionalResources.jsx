import React from 'react';
import environment from 'platform/utilities/environment';

export const AdditionalResourcesLinks = () => (
  <div>
    <p>
      <a
        href="https://va.careerscope.net/gibill"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get started with CareerScope
      </a>
    </p>
    <p>
      <a
        href="https://www.benefits.va.gov/gibill/choosing_a_school.asp"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get help choosing a school
      </a>
    </p>
    <p>
      <a
        href="/education/submit-school-feedback"
        target="_blank"
        rel="noopener noreferrer"
      >
        Submit a complaint through our Feedback System
      </a>
    </p>
    <p>
      <a
        href="/education/how-to-apply/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Apply for education benefits
      </a>
    </p>
  </div>
);
const prodFlagAdditonalResources = environment.isProduction()
  ? 'additional-resources usa-width-one-third medium-4 small-12 column'
  : 'additional-resources-responsive usa-width-one-third medium-4 small-12 column';

const AdditionalResources = () => (
  <div className={prodFlagAdditonalResources}>
    <h4 className="highlight">Additional resources</h4>
    <AdditionalResourcesLinks />
  </div>
);

export default AdditionalResources;
