import React from 'react';

export const VetTecAdditionalResourcesLinks = () => (
  <div>
    <p>
      <a
        href="/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about VET TEC
      </a>
    </p>
    <p>
      <a
        href="/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994/introduction"
        target="_blank"
      >
        Apply for VET TEC
      </a>
    </p>
    <p>
      <a
        href="/education/submit-school-feedback"
        target="/education/submit-school-feedback/introduction"
        rel="noopener noreferrer"
      >
        Submit a complaint through our Feedback System
      </a>
    </p>
  </div>
);

const VetTecAdditionalResources = () => (
  <div className="additional-resources usa-width-one-third medium-4 small-12 column">
    <div className="vettec-logo-container">
      <img
        className="vettec-logo"
        src={require('site/assets/img/logo/vet-tec-logo.png')}
        alt="Vet Tec Logo"
      />
    </div>
    <h4 className="highlight vettec-additional-resources-header">
      Additional Resources
    </h4>
    <VetTecAdditionalResourcesLinks />
  </div>
);

export default VetTecAdditionalResources;
