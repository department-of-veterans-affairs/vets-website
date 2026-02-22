/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import PropTypes from 'prop-types';
import {
  buildBottomRail,
  buildColumn,
  getFormattedFooterData,
} from '../../../utilities/footer';

const MobileFooter = ({ footerData }) => {
  const columns = getFormattedFooterData(footerData);
  const bottomRail = columns.bottom_rail;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="usa-grid-full flex-container">
          <ul className="usa-accordion">
            <li>
              <div className="vads-u-background-color--secondary-darkest vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center vads-u-text-align--center vads-u-padding--1">
                <button
                  className="va-button-link vads-u-color--white vads-u-text-decoration--none vcl-modal-open"
                  type="button"
                >
                  Talk to the <strong>Veterans Crisis Line</strong> now
                  <svg
                    aria-hidden="true"
                    className="vads-u-margin-left--0p5"
                    focusable="false"
                    width="16"
                    viewBox="7 1 17 17"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#fff"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"
                    />
                  </svg>
                </button>
              </div>
            </li>
            <li>
              <span>
                <button
                  className="usa-accordion-button va-footer-button"
                  aria-controls="veteran-contact"
                  itemProp="name"
                  aria-expanded="false"
                  type="button"
                >
                  Contact us
                </button>
              </span>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                id="veteran-contact"
                aria-hidden="true"
              >
                <h2 className="va-footer-linkgroup-title vads-u-padding-bottom--1">
                  Get answers
                </h2>
                {buildColumn(columns, 4)}
              </div>
            </li>
            <li>
              <button
                className="usa-accordion-button va-footer-button"
                aria-controls="footer-veteran-programs"
                itemProp="name"
                aria-expanded="false"
                type="button"
              >
                Veteran programs and services
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                aria-hidden="true"
                id="footer-veteran-programs"
              >
                {buildColumn(columns, 1)}
              </div>
            </li>
            <li>
              <button
                className="usa-accordion-button va-footer-button"
                aria-controls="veteran-resources"
                itemProp="name"
                aria-expanded="false"
                type="button"
              >
                More VA resources
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                aria-hidden="true"
                id="veteran-resources"
              >
                {buildColumn(columns, 2)}
              </div>
            </li>
            <li>
              <button
                className="usa-accordion-button va-footer-button"
                aria-controls="veteran-connect"
                itemProp="name"
                aria-expanded="false"
                type="button"
              >
                Get VA updates
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                id="veteran-connect"
                aria-hidden="true"
              >
                {buildColumn(columns, 3)}
              </div>
            </li>
            <li>
              <h2 className="va-footer-linkgroup-title">
                <button
                  className="usa-accordion-button va-footer-button"
                  aria-controls="veteran-language-support"
                  itemProp="name"
                  aria-expanded="false"
                  type="button"
                >
                  Language assistance
                </button>
              </h2>
              <div
                className="usa-accordion-content va-footer-accordion-content vads-u-padding-bottom--0 vads-u-padding-left--0p5"
                id="veteran-language-support"
                aria-hidden="true"
              >
                <div className="usa-grid usa-grid-full va-footer-links-bottom">
                  <ul className="vads-u-margin-top--0 vads-u-margin-bottom--0 vads-u-padding-bottom--0">
                    <li>
                      <a
                        href="https://www.va.gov/asistencia-y-recursos-en-espanol"
                        lang="es"
                        hrefLang="es"
                      >
                        Español
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.va.gov/tagalog-wika-mapagkukunan-at-tulong"
                        lang="tl"
                        hrefLang="tl"
                      >
                        Tagalog
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.va.gov/resources/how-to-get-free-language-assistance-from-va/"
                        lang="en"
                        hrefLang="en"
                      >
                        Other languages
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="usa-grid usa-grid-full vads-u-padding-bottom--4 vads-u-padding-top--2 vads-u-padding-x--0p5">
        <a href="https://www.va.gov" title="Go to VA.gov">
          <img
            src="https://www.va.gov/img/homepage/va-logo-white.png"
            alt="VA logo and Seal, U.S. Department of Veterans Affairs"
            width="200"
            className="vads-u-height--auto"
          />
        </a>
      </div>
      <div className="usa-grid usa-grid-full vads-u-margin-bottom--3 va-footer-links-bottom">
        <ul>{buildBottomRail(bottomRail)}</ul>
      </div>
    </footer>
  );
};

MobileFooter.propTypes = {
  footerData: PropTypes.array.isRequired,
};

export default MobileFooter;
