import React from 'react';

export const VetTecAdditionalResourcesLinks = () => (
  <div>
    <p>
      <a
        href="https://www.benefits.va.gov/gibill/fgib/VetTec.asp"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about VET TEC
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
        href="/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994/"
        target="_blank"
      >
        Apply for VET TEC
      </a>
    </p>
  </div>
);

const VetTecAdditionalResources = () => (
  <div className="additional-resources usa-width-one-third medium-4 small-12 column">
    <h4 className="highlight">Additional Resources</h4>
    <VetTecAdditionalResourcesLinks />
  </div>
);

export default VetTecAdditionalResources;
