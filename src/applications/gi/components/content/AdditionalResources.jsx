import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export const AdditionalResourcesLinks = () => (
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
        href="https://www.benefits.va.gov/gibill/choosing_a_school.asp"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Get help choosing a school
      </a>
    </p>
    <p>
      <a
        href="/education/submit-school-feedback"
        target="_blank"
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
    <p>
      <a
        href="/education/how-to-apply/"
        target="_blank"
        onClick={() =>
          recordEvent({
            event: 'nav-profile-additional-resources',
          })
        }
      >
        Apply for education benefits
      </a>
    </p>
  </div>
);

const AdditionalResources = () => (
  <div className="additional-resources usa-width-one-third medium-4 small-12 column">
    <h4 className="highlight">Additional Resources</h4>
    <AdditionalResourcesLinks />
  </div>
);

export default AdditionalResources;
