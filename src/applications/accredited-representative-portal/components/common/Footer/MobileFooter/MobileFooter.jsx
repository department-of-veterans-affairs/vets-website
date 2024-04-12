import React from 'react';
import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

const MobileFooter = () => {
  return (
    <div data-testid="mobile-footer" className="mobile">
      <div className="footer-inner">
        <div aria-hidden="false" className="va-footer-content">
          <ul className="usa-accordion va-footer-accordion">
            <li>
              <div className="vads-u-background-color--secondary-darkest vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center vads-u-text-align--center vads-u-padding--0p5">
                <button
                  className="va-button-link vads-u-color--white vads-u-text-decoration--none va-overlay-trigger"
                  data-show="#modal-crisisline"
                  id="footer-crisis-line"
                >
                  Talk to the <strong>Veterans Crisis Line</strong> now
                  <i
                    aria-hidden="true"
                    className="fa fa-chevron-right vads-u-margin-left--1"
                  />
                </button>
              </div>
            </li>
            <li>
              <button
                className="usa-button-unstyled usa-accordion-button va-footer-button"
                aria-controls="footer-accredited-reps"
                itemProp="name"
                aria-expanded="false"
              >
                For accredited representatives
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                aria-hidden="true"
                id="footer-accredited-reps"
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
              <button
                className="usa-button-unstyled usa-accordion-button va-footer-button"
                aria-controls="footer-veteran-programs"
                itemProp="name"
                aria-expanded="false"
              >
                Veteran programs and services
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                aria-hidden="true"
                id="footer-veteran-programs"
              >
                <ul className="va-footer-links">
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
        <div
          id="modal-crisisline"
          className="va-overlay va-modal va-modal-large"
          role="alertdialog"
        >
          <div className="va-crisis-panel va-modal-inner">
            <button
              aria-label="Close this modal"
              className="va-modal-close va-overlay-close va-crisis-panel-close"
              type="button"
            >
              <i
                className="fas fa-times-circle va-overlay-close"
                aria-hidden="true"
              />
            </button>
            <div className="va-overlay-body va-crisis-panel-body">
              <h3 className="va-crisis-panel-title">
                We’re here anytime, day or night - 24/7
              </h3>
              <p>
                If you are a Veteran in crisis or concerned about one, connect
                with our caring, qualified responders for confidential help.
                Many of them are Veterans themselves.
              </p>
              <ul className="va-crisis-panel-list">
                <li>
                  <i
                    className="fa fa-phone va-crisis-panel-icon"
                    aria-hidden="true"
                  />
                  Call{' '}
                  <strong>
                    <va-telephone contact="988" /> and select 1
                  </strong>
                </li>
                <li>
                  <i
                    className="fa fa-mobile-alt va-crisis-panel-icon"
                    aria-hidden="true"
                  />
                  Text <va-telephone contact="838255" sms />
                </li>
                <li>
                  <i
                    className="fa fa-comments va-crisis-panel-icon"
                    aria-hidden="true"
                  />
                  <a
                    className="no-external-icon"
                    href="https://www.veteranscrisisline.net/get-help-now/chat/"
                  >
                    Start a confidential chat
                  </a>
                </li>
                <li>
                  <i
                    className="fa fa-deaf va-crisis-panel-icon"
                    aria-hidden="true"
                  />
                  <p>
                    For TTY, call{' '}
                    <strong>
                      <va-telephone contact="711" aria-label="7 1 1" /> then 988
                    </strong>
                  </p>
                </li>
              </ul>
              Get more resources at{' '}
              <a
                className="no-external-icon"
                href="https://www.veteranscrisisline.net/"
              >
                VeteransCrisisLine.net
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;
