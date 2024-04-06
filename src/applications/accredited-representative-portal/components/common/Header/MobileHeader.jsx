import React from 'react';

import '../../../sass/accredited-representative-portal.scss';

const MobileHeader = () => {
  return (
    <div
      className="mobile"
      data-widget-type="header"
      data-show="true"
      data-show-nav-login="true"
      data-show-mega-menu="true"
      id="header-v2"
    >
      <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          <div className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-text-align--center vads-u-padding--0p5">
            <img
              alt="U.S. flag"
              className="header-us-flag vads-u-margin-right--1"
              src="https://www.va.gov/img/tiny-usa-flag.png"
            />
            {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
            <button
              aria-controls="official-govt-site-explanation"
              aria-expanded="false"
              className="expand-official-govt-explanation va-button-link vads-u-text-decoration--none"
            >
              An official website of the United States government.
              <i
                aria-hidden="true"
                className="fa fa-chevron-down vads-u-margin-left--0p5"
              />
            </button>
          </div>
        </div>
        <div className="vads-u-background-color--secondary-darkest vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center vads-u-text-align--center vads-u-padding--0p5">
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
          <button
            className="va-button-link vads-u-color--white vads-u-text-decoration--none va-overlay-trigger"
            data-show="#modal-crisisline"
            id="header-crisis-line"
          >
            Talk to the <strong>Veterans Crisis Line</strong> now
            <i
              aria-hidden="true"
              className="fa fa-chevron-right vads-u-margin-left--1"
            />
          </button>
        </div>
        <nav className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
          <div className="header-logo-row vads-u-background-color--primary-darkest vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-padding-y--1p5 vads-u-padding-left--1p5 vads-u-padding-right--1">
            <a
              aria-label="VA logo"
              className="header-logo vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center"
              href="/"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 57.6 35.2"
                role="img"
              >
                <title>VA</title>
                <g fill="#FFF">
                  <path d="M11.1 35.2L0 0h8.6l4.2 14.9c1.2 4.2 2.2 8.2 3.1 12.6h.1c.9-4.2 1.9-8.4 3.1-12.4L23.5 0h8.3L20.2 35.2h-9.1zM36.6 26.2l-2.5 9h-8L36.6 0h10.2l10.8 35.2h-8.5l-2.7-9h-9.8zm8.8-6l-2.2-7.5c-.6-2.1-1.2-4.7-1.7-6.8h-.1c-.5 2.1-1 4.8-1.6 6.8l-2 7.5h7.6z" />
                </g>
              </svg>
            </a>
            <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center">
              <div className="profile-nav-container">
                <div className="hidden-header vads-u-display--flex vads-u-align-items--center">
                  <div className="sign-in-nav">
                    <div className="sign-in-links">
                      <button className="sign-in-link">Sign in</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
              <button
                aria-controls="header-nav-items"
                aria-expanded="false"
                className="header-menu-button usa-button vads-u-background-color--gray-lightest vads-u-color--link-default vads-u-padding-y--1 vads-u-padding-x--1p5 vads-u-margin--0 vads-u-margin-left--2 vads-u-position--relative"
                type="button"
              >
                Menu
                <i
                  aria-hidden="true"
                  className="fa fa-bars vads-u-margin-left--1 vads-u-font-size--sm"
                />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileHeader;
