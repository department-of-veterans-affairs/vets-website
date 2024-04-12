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
          <div className="va-footer-linkgroup" id="footer-reps">
            <h2 className="va-footer-linkgroup-title">
              For Accredited Representatives
            </h2>
            <ul className="va-footer-links">
              <li>
                <a href="https://va.gov/representative">VA forms</a>
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
          <div className="va-footer-linkgroup" id="footer-services">
            <h2 className="va-footer-linkgroup-title">For Veterans</h2>
            <ul className="va-footer-links">
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
          <div className="va-footer-linkgroup" id="footer-services-more">
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
          <div className="va-footer-linkgroup" id="veteran-crisis">
            <h2 className="va-footer-linkgroup-title">
              In crisis? Talk to someone now
            </h2>
            <ul className="va-footer-links">
              <li>
                <va-button
                  className="va-button-link va-overlay-trigger"
                  data-show="#modal-crisisline"
                >
                  Veterans Crisis Line
                </va-button>
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
            />
          </a>
        </div>
        <div className="usa-grid usa-grid-full va-footer-links-bottom">
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
      <div
        id="modal-crisisline"
        className="va-overlay va-modal va-modal-large"
        role="alertdialog"
      >
        <div className="va-crisis-panel va-modal-inner">
          <va-button
            aria-label="Close this modal"
            className="va-modal-close va-overlay-close va-crisis-panel-close"
            type="button"
          >
            <i
              className="fas fa-times-circle va-overlay-close"
              aria-hidden="true"
            />
          </va-button>
          <div className="va-overlay-body va-crisis-panel-body">
            <h3 className="va-crisis-panel-title">
              We’re here anytime, day or night - 24/7
            </h3>
            <p>
              If you are a Veteran in crisis or concerned about one, connect
              with our caring, qualified responders for confidential help. Many
              of them are Veterans themselves.
            </p>
            <ul className="va-crisis-panel-list">
              <li>
                <i
                  className="fa fa-phone va-crisis-panel-icon"
                  aria-hidden="true"
                />
                Call{' '}
                <strong>
                  <va-telephone contact="988" aria-label="9 8 8" /> and select 1
                </strong>
              </li>
              <li>
                <i
                  className="fa fa-mobile-alt va-crisis-panel-icon"
                  aria-hidden="true"
                />
                Text <va-telephone contact="838255" sms aria-label="838255" />
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
                  <va-telephone contact="711" />
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
  );
};

export default WiderThanMobileFooter;
