import React from 'react';
import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

const MobileFooter = () => {
  return (
    <div data-testid="mobile-footer" className="mobile">
      <div className="footer-inner">
        <div className="va-footer-content">
          <ul
            className="usa-accordion va-footer-accordion"
            data-testid="mobile-footer-accordion"
          >
            <li>
              {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
              <button
                className="usa-button-unstyled usa-accordion-button va-footer-button"
                aria-controls="footer-accredited-reps"
                itemProp="name"
                aria-expanded="false"
                data-testid="mobile-footer-accredited-reps-button"
              >
                For Accredited Representatives
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                aria-hidden="true"
                id="footer-accredited-reps"
                data-testid="mobile-footer-accredited-reps"
              >
                <ul className="va-footer-links">
                  <li>
                    <a href="https://va.gov">VA forms</a>
                  </li>
                  <li>
                    <a href="https://va.gov">Portal user guide</a>
                  </li>
                  <li>
                    <a href="https://va.gov">Contact us</a>
                  </li>
                  <li>
                    <a href="https://va.gov">Roadmap and upcoming features</a>
                  </li>
                  <li>
                    <a href="https://va.gov">Sitemap</a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
              <button
                className="usa-button-unstyled usa-accordion-button va-footer-button"
                aria-controls="mobile-footer-veteran-programs"
                itemProp="name"
                aria-expanded="false"
                data-testid="mobile-footer-veteran-programs-button"
              >
                For Veterans
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                aria-hidden="true"
                id="mobile-footer-veteran-programs"
                data-testid="mobile-footer-veteran-programs"
              >
                <ul className="va-footer-links">
                  <li>
                    <a href="/resources/" target="">
                      Resources
                    </a>
                  </li>
                  <li>
                    <a href="/homeless/" target="">
                      Homeless Veterans
                    </a>
                  </li>
                  <li>
                    <a href="/womenvet/" target="">
                      Women Veterans
                    </a>
                  </li>
                  <li>
                    <a href="/centerforminorityveterans/" target="">
                      Minority Veterans
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.patientcare.va.gov/lgbt/"
                      target=""
                      rel="noopener noreferrer"
                    >
                      LGBTQ+ Veterans
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.ptsd.va.gov"
                      target=""
                      rel="noopener noreferrer"
                    >
                      PTSD
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.mentalhealth.va.gov"
                      target=""
                      rel="noopener noreferrer"
                    >
                      Mental health
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://department.va.gov/veteran-sports/"
                      target=""
                    >
                      Adaptive sports and special events
                    </a>
                  </li>
                  <li>
                    <a href="/outreach-and-events/events/">
                      VA outreach events
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.nrd.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      National Resource Directory
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div className="usa-grid usa-grid-full footer-banner">
            <a href="/" title="Go to VA.gov">
              <img
                src={replaceWithStagingDomain(
                  'https://www.va.gov/img/homepage/va-logo-white.png',
                )}
                alt="VA logo and Seal, U.S. Department of Veterans Affairs"
                width="200"
                className="vads-u-height--auto"
                data-testid="mobile-footer-logo"
              />
            </a>
          </div>
          <div className="usa-grid usa-grid-full va-footer-links-bottom">
            <ul>
              <li>
                <a href="/accessibility-at-va" rel="noopener noreferrer">
                  Accessibility
                </a>
              </li>
              <li>
                <a href="/resources/your-civil-rights-and-how-to-file-a-discrimination-complaint/">
                  Civil Rights
                </a>
              </li>
              <li>
                <a href="https://department.va.gov/foia/">
                  Freedom of Information Act (FOIA)
                </a>
              </li>
              <li>
                <a href="/report-harassment/">Harassment</a>
              </li>
              <li>
                <a href="/oig/">Office of Inspector General</a>
              </li>
              <li>
                <a href="/opa/Plain_Language.asp">Plain language</a>
              </li>
              <li>
                <a href="/privacy-policy/">
                  Privacy, policies, and legal information
                </a>
              </li>
              <li>
                <a href="https://www.oprm.va.gov/">VA Privacy Service</a>
              </li>
              <li>
                <a href="/ormdi/NOFEAR_Select.asp">No FEAR Act Data</a>
              </li>
              <li>
                <a
                  href="https://www.usa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  USA.gov
                </a>
              </li>
              <li>
                <a
                  href="/performance-dashboard/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VA performance dashboard
                </a>
              </li>
              <li>
                <a href="/veterans-portrait-project/">
                  Veterans Portrait Project
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;
