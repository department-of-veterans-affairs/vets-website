import React from 'react';
import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

const WiderThanMobileFooter = () => {
  return (
    <div data-testid="wider-than-mobile-footer" className="wider-than-mobile">
      <div className="footer-inner">
        <div
          aria-hidden="false"
          className="usa-grid-full flex-container usa-grid-flex-mobile va-footer-content"
        >
          <div
            className="va-footer-linkgroup"
            id="footer-reps"
            data-testid="wider-than-mobile-footer-full-accredited-reps"
          >
            <h2 className="va-footer-linkgroup-title">
              For Accredited Representatives
            </h2>
            <ul className="va-footer-links">
              <li>
                <a href="https://www.va.gov/find-forms/">VA forms</a>
              </li>
              <li>
                <a href="https://va.gov/representative">Portal user guide</a>
              </li>
              <li>
                <a href="https://va.gov/representative">Contact us</a>
              </li>
              <li>
                <a href="https://va.gov/representative">
                  Roadmap and upcoming features
                </a>
              </li>
              <li>
                <a href="https://va.gov/representative">Sitemap</a>
              </li>
            </ul>
          </div>
          <div
            className="va-footer-linkgroup"
            id="footer-programs"
            data-testid="wider-than-mobile-footer-full-veteran-programs"
          >
            <h2 className="va-footer-linkgroup-title">For Veterans</h2>
            <ul className="va-footer-links">
              <li>
                <a href="https://va.gov/resources/">Resources</a>
              </li>
              <li>
                <a href="https://va.gov/homeless/">Homeless Veterans</a>
              </li>
              <li>
                <a href="https://va.gov/womenvet/">Women Veterans</a>
              </li>
              <li>
                <a href="https://va.gov/centerforminorityveterans/">
                  Minority Veterans
                </a>
              </li>
              <li>
                <a href="https://www.patientcare.va.gov/lgbt/">
                  LGBTQ+ Veterans
                </a>
              </li>
            </ul>
          </div>
          <div
            className="va-footer-linkgroup"
            id="footer-services-more"
            data-testid="wider-than-mobile-footer-full-veteran-programs-more"
          >
            <ul className="vads-u-margin-top--5 va-footer-links">
              <li>
                <a href="https://www.ptsd.va.gov/">PTSD</a>
              </li>
              <li>
                <a href="https://www.mentalhealth.va.gov/">Mental health</a>
              </li>
              <li>
                <a href="https://department.va.gov/veteran-sports/">
                  Adaptive sports and special events
                </a>
              </li>
              <li>
                <a href="https://va.gov/outreach-and-events/events/">
                  VA outreach events
                </a>
              </li>
              <li>
                <a href="https://www.nrd.gov/">National Resource Directory</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="usa-grid usa-grid-full footer-banner vads-u-border-color--white vads-u-border-top--1px vads-u-padding-top--2">
          <a href="/" title="Go to VA.gov">
            <img
              src={replaceWithStagingDomain(
                'https://www.va.gov/img/homepage/va-logo-white.png',
              )}
              alt="VA logo and Seal, U.S. Department of Veterans Affairs"
              width="200"
              className="vads-u-height--auto"
              data-testid="wider-than-mobile-footer-full-logo"
            />
          </a>
        </div>
        <div
          className="usa-grid usa-grid-full va-footer-links-bottom"
          data-testid="wider-than-mobile-footer-full-links-bottom"
        >
          <ul>
            <li>
              <a href="https://va.gov/accessibility-at-va">Accessibility</a>
            </li>
            <li>
              <a href="https://va.gov/resources/your-civil-rights-and-how-to-file-a-discrimination-complaint/">
                Civil Rights
              </a>
            </li>
            <li>
              <a href="https://department.va.gov/foia/">
                Freedom of Information Act (FOIA)
              </a>
            </li>
            <li>
              <a href="https://va.gov/report-harassment/">Harassment</a>
            </li>
            <li>
              <a href="https://va.gov/oig/">Office of Inspector General</a>
            </li>
            <li>
              <a href="https://va.gov/opa/Plain_Language.asp">Plain language</a>
            </li>
            <li>
              <a href="https://va.gov/privacy-policy/">
                Privacy, policies, and legal information
              </a>
            </li>
            <li>
              <a href="https://www.oprm.va.gov/">VA Privacy Service</a>
            </li>
            <li>
              <a href="https://va.gov/ormdi/NOFEAR_Select.asp">
                No FEAR Act Data
              </a>
            </li>
            <li>
              <a href="https://www.usa.gov/">USA.gov</a>
            </li>
            <li>
              <a href="https://va.gov/performance-dashboard/">
                VA performance dashboard
              </a>
            </li>
            <li>
              <a href="https://va.gov/veterans-portrait-project/">
                Veterans Portrait Project
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WiderThanMobileFooter;
