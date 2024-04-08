import React from 'react';
import { Link } from 'react-router';

const Menu = () => {
  return (
    <div className="usa-grid usa-grid-full">
      <div className="menu-rule usa-one-whole" />
      <div id="mega-menu">
        <div className="hidden-header login-container">
          <div className="row va-flex">
            <div id="vetnav" role="navigation">
              <ul id="vetnav-menu">
                <li>
                  <a
                    className="vetnav-level1"
                    data-testid="mobile-home-nav-link"
                    href="/"
                  >
                    Home
                  </a>
                </li>
                <li>
                  {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
                  <button
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
                    className="vetnav-level1 medium-screen:vads-u-padding--2"
                    to="/poa-requests"
                  >
                    Power of Attorney
                  </Link>
                </li>
                <li>
                  {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
                  <button
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
    </div>
  );
};

export default Menu;
