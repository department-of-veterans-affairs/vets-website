import React from 'react';
import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

const MobileFooter = () => {
  return (
    <div data-testid="mobile-footer" className="mobile">
      <div className="footer-inner">
        <div className="va-footer-content">
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
          <div
            data-testid="mobile-footer-full-links-bottom"
            className="usa-grid usa-grid-full va-footer-links-bottom"
          >
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
