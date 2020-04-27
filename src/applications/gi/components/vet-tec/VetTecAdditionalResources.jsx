import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { renderVetTecLogo } from '../../utils/render';
import classNames from 'classnames';

export const VetTecAdditionalResourcesLinks = () => (
  <div>
    <p>
      <a
        href="https://va.careerscope.net/gibill"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Get started with CareerScope
      </a>
    </p>
    <p>
      <a
        href="/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Learn more about VET TEC
      </a>
    </p>
    <p>
      <a
        href="/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994/introduction"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Apply for VET TEC
      </a>
    </p>
    <p>
      <a
        href="/education/submit-school-feedback"
        target="/education/submit-school-feedback/introduction"
        rel="noopener noreferrer"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Submit a complaint through our Feedback System
      </a>
    </p>
  </div>
);

const additonalResources =
  'additional-resources-vettec  usa-width-one-third medium-4 small-12 column';

const VetTecAdditionalResources = () => (
  <div className={additonalResources}>
    <div className="vads-u-margin-left--4">
      <div className="logo-container">
        {renderVetTecLogo(classNames('vettec-logo-additional-resources'))}
      </div>
    </div>
    <h2 className="highlight vettec-additional-resources-header vads-u-font-size--h4">
      Additional resources
    </h2>
    <VetTecAdditionalResourcesLinks />
  </div>
);

export default VetTecAdditionalResources;
