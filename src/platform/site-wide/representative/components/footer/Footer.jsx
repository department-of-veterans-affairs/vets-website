import React from 'react';
import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';
import './footer.scss';

const Footer = () => {
  return (
    <footer data-testid="arp-footer" className="footer arp-footer">
      <div className="arp-footer__container">
        <h2 className="vads-u-font-size--h3">
          Accredited Representative Portal
        </h2>
        <p>
          An official website of the{' '}
          <a className="vads-u-color--white" href="https://va.gov">
            U.S. Department of Veterans Affairs
          </a>
        </p>
        <a href="/" title="Go to VA.gov">
          <img
            src={replaceWithStagingDomain(
              'https://www.va.gov/img/homepage/va-logo-white.png',
            )}
            alt="VA logo and Seal, U.S. Department of Veterans Affairs"
            width="340"
            className="vads-u-height--auto"
            data-testid="footer-full-logo"
          />
        </a>
      </div>
      <div
        className="usa-grid usa-grid-full va-footer-links-bottom"
        data-testid="footer-full-links-bottom"
      >
        <ul>
          <li>
            <a href="https://www.va.gov/ogc/accreditation.asp">
              About Accreditation
            </a>
          </li>
          <li>
            <a href="https://department.va.gov/about/">About VA</a>
          </li>
          <li>
            <a href="https://va.gov/accessibility-at-va">Accessibility</a>
          </li>
          <li>
            <a href="https://department.va.gov/foia/">
              Freedom of Information Act (FOIA)
            </a>
          </li>
          <li>
            <a href="https://va.gov/ormdi/NOFEAR_Select.asp">
              No FEAR Act data
            </a>
          </li>
          <li>
            <a href="https://va.gov/oig/">Office of Inspector General</a>
          </li>
          <li>
            <a href="https://va.gov/privacy-policy/">
              Privacy, policies, and legal information
            </a>
          </li>

          <li>
            <a href="https://va.gov/performance-dashboard/">
              VA performance dashboard
            </a>
          </li>
        </ul>
      </div>
      <div className="usa-grid usa-grid-full">
        <p>
          Looking for U.S. government information and services?
          <a
            className="vads-u-color--white vads-u-padding-left--0p5"
            href="https://usa.gov"
          >
            Visit USA.gov
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
