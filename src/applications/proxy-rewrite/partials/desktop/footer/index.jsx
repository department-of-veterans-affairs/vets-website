/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import PropTypes from 'prop-types';
import {
  buildBottomRail,
  buildColumn,
  getFormattedFooterData,
} from '../../../utilities/footer';

const DesktopFooter = ({ footerData }) => {
  const columns = getFormattedFooterData(footerData);
  const bottomRail = columns.bottom_rail;

  return (
    <footer className="vads-u-margin-bottom--9 footer ts-footer-container">
      <div className="footer-inner">
        <div className="usa-grid-full flex-container">
          <div className="va-footer-linkgroup">
            <h2 className="va-footer-linkgroup-title">
              Veteran programs and services
            </h2>
            {buildColumn(columns, 1)}
          </div>
          <div className="va-footer-linkgroup">
            <h2 className="va-footer-linkgroup-title">More VA resources</h2>
            {buildColumn(columns, 2)}
          </div>
          <div className="va-footer-linkgroup">
            <h2 className="va-footer-linkgroup-title">Get VA updates</h2>
            {buildColumn(columns, 3)}
          </div>
          <div className="va-footer-linkgroup">
            <h2 className="va-footer-linkgroup-title">
              In crisis? Talk to someone now
            </h2>
            <ul className="va-footer-links">
              <li>
                <button className="va-button-link vcl-modal-open" type="button">
                  Veterans Crisis Line
                </button>
              </li>
            </ul>
            <h2 className="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">
              Get answers
            </h2>
            {buildColumn(columns, 4)}
          </div>
        </div>
        {/* Language section */}
        <div className="usa-grid usa-grid-full va-footer-links-bottom vads-u-border-color--white vads-u-border-bottom--1px vads-u-border-top--1px vads-u-padding-top--2 vads-u-padding-bottom--1p5 vads-u-padding-left--0">
          <h2 className="va-footer-linkgroup-title vads-u-padding-bottom--1">
            Language assistance
          </h2>
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

        {/* Bottom rail */}
        <div className="usa-grid usa-grid-full vads-u-padding-y--2 vads-u-padding-x--0p5">
          <a href="https://www.va.gov" title="Go to VA.gov">
            <img
              src="https://www.va.gov/img/homepage/va-logo-white.png"
              alt="VA logo and Seal, U.S. Department of Veterans Affairs"
              width="200"
              className="vads-u-height--auto"
            />
          </a>
        </div>
        <div className="usa-grid usa-grid-full va-footer-links-bottom">
          <ul>{buildBottomRail(bottomRail)}</ul>
        </div>
      </div>
    </footer>
  );
};

DesktopFooter.propTypes = {
  footerData: PropTypes.array.isRequired,
};

export default DesktopFooter;
