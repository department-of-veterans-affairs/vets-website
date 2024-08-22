import React from 'react';
import { Link } from 'react-router';

const WiderThanMobileMenu = () => {
  return (
    <div className="usa-grid usa-grid-full">
      <div className="menu-rule usa-one-whole" />
      <div className="mega-menu">
        <div className="hidden-header login-container">
          <div className="row va-flex">
            <ul className="vetnav-menu">
              <li>
                <a className="vetnav-level1" href="/">
                  Home
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
                <button
                  data-testid="wider-than-mobile-menu-about-button"
                  aria-expanded="false"
                  aria-controls="vetnav-about"
                  aria-haspopup="true"
                  className="vetnav-level1"
                  type="button"
                >
                  About
                </button>
                <div id="vetnav-about" className="vetnav-panel" hidden />
              </li>
              <li>
                <Link
                  data-testid="wider-than-mobile-menu-poa-link"
                  className="vetnav-level1 medium-screen:vads-u-padding--2"
                  to="/poa-requests"
                >
                  Power of attorney
                </Link>
              </li>
              <li>
                {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
                <button
                  data-testid="wider-than-mobile-menu-accreditation-button"
                  aria-expanded="false"
                  aria-controls="vetnav-accreditation"
                  aria-haspopup="true"
                  className="vetnav-level1"
                  type="button"
                >
                  Accreditation
                </button>
                <div
                  id="vetnav-accreditation"
                  className="vetnav-panel"
                  hidden
                />
              </li>
              <li>
                {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
                <button
                  data-testid="wider-than-mobile-menu-resources-button"
                  aria-expanded="false"
                  aria-controls="vetnav-resources"
                  aria-haspopup="true"
                  className="vetnav-level1"
                  type="button"
                >
                  Resources
                </button>
                <div id="vetnav-resources" className="vetnav-panel" hidden />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WiderThanMobileMenu;
