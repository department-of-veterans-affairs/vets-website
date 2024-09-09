/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MegaMenu from './mega-menu';
import { keyDownHandler } from '../../../utilities/keydown';
import Search from '../../search';

const DesktopHeader = ({ isDesktop, megaMenuData }) => {
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const searchContainer = document.getElementsByClassName('va-dropdown')?.[0];

  // If a click is made outside the search button or the dropdown, close the search dropdown
  const outsideClickHandler = event => {
    if (searchIsOpen && !searchContainer?.contains(event.target)) {
      setSearchIsOpen(false);
    }
  };

  const toggleSearchDropdown = () => {
    setSearchIsOpen(!searchIsOpen);
  };

  useEffect(() => {
    const htmlElement = document.getElementsByTagName('html')[0];

    htmlElement.addEventListener('click', outsideClickHandler);

    return () => {
      htmlElement.removeEventListener('click', outsideClickHandler);
    };
  });

  return (
    <header role="banner">
      <div id="preview-site-alert" />

      {/* US Govt banner */}
      <div className="va-notice--banner">
        <div className="va-notice--banner-inner">
          <div className="usa-banner expand-official-govt-explanation">
            <div className="usa-accordion">
              <div className="usa-banner-header">
                <div className="usa-grid usa-banner-inner">
                  <img
                    src="https://www.va.gov/img/tiny-usa-flag.png"
                    alt="U.S. flag"
                    height="20"
                    width="20"
                  />
                  <p>An official website of the United States government</p>
                  <button
                    className="usa-accordion-button usa-banner-button"
                    aria-expanded="false"
                    aria-controls="gov-banner"
                  >
                    <span className="usa-banner-button-text">
                      Here’s how you know
                    </span>
                  </button>
                </div>
              </div>
              <div
                className="usa-banner-content usa-grid usa-accordion-content vads-u-padding-x--1"
                id="gov-banner"
                aria-hidden="true"
              >
                <div className="usa-banner-guidance-gov usa-width-one-half">
                  <img
                    className="usa-banner-icon usa-media_block-img"
                    src="https://www.va.gov/img/icon-dot-gov.svg"
                    alt="Dot gov"
                  />
                  <div className="usa-media_block-body">
                    <p>
                      <strong>The .gov means it’s official.</strong>
                      <br />
                      Federal government websites often end in .gov or .mil.
                      Before sharing sensitive information, make sure you’re on
                      a federal government site.
                    </p>
                  </div>
                </div>
                <div className="usa-width-one-half">
                  <img
                    className="usa-banner-icon usa-media_block-img"
                    src="https://www.va.gov/img/icon-https.svg"
                    alt="SSL"
                  />
                  <div className="usa-media_block-body">
                    <p>
                      <strong>The site is secure.</strong>
                      <br /> The <strong>https://</strong> ensures that you’re
                      connecting to the official website and that any
                      information you provide is encrypted and sent securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end US Govt banner */}

      {/* start Veterans Crisis Line banner */}
      <div className="vcl-crisis-line-container vads-u-background-color--secondary-darkest">
        <button
          className="vcl-modal-open vads-u-background-color--secondary-darkest"
          type="button"
        >
          <div className="vcl-crisis-line-inner">
            <span className="vcl-crisis-line-icon" aria-hidden="true" />
            <span className="vcl-crisis-line-text">
              Talk to the <strong>Veterans Crisis Line</strong> now
            </span>
            <svg
              aria-hidden="true"
              focusable="false"
              width="16"
              height="16"
              viewBox="8 3 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"
              />
            </svg>
          </div>
        </button>
      </div>
      {/* end Veterans Crisis Line banner */}

      <div
        className="vads-u-padding-top--3 vads-u-display--flex usa-grid vads-u-font-size--base"
        id="va-header-logo-menu"
      >
        <div className="va-header-logo-wrapper">
          <a href="https://www.va.gov" className="va-header-logo desktop">
            <img
              src="https://www.va.gov/img/header-logo.png"
              alt="VA logo and Seal, U.S. Department of Veterans Affairs"
            />
          </a>
        </div>
        <div id="login-root">
          <div className="profile-nav-container">
            <div className="vads-u-display--flex vads-u-align-items--center vads-u-padding-top--1">
              {/* start Search */}
              <div className="va-dropdown">
                <button
                  id="search-dropdown-button"
                  className="va-btn-withicon va-dropdown-trigger"
                  aria-expanded={searchIsOpen}
                  onClick={toggleSearchDropdown}
                  onKeyDown={event =>
                    keyDownHandler(event, toggleSearchDropdown)
                  }
                >
                  <span>
                    <svg
                      aria-hidden="true"
                      className="vads-u-margin-right--0p5"
                      focusable="false"
                      width="24"
                      viewBox="2 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#fff"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                      />
                    </svg>
                    Search
                  </span>
                </button>
                <div
                  id="search"
                  className="va-dropdown-panel vads-u-padding--0 vads-u-margin--0"
                  hidden={!searchIsOpen}
                >
                  <Search isDesktop={isDesktop} searchIsOpen={searchIsOpen} />
                </div>
              </div>
              {/* end Search */}

              <a
                className="vads-u-color--white vads-u-text-decoration--none vads-u-padding-left--1 vads-u-padding-right--2 vads-u-font-weight--bold"
                href="https://www.va.gov/contact-us/"
              >
                Contact us
              </a>
              <a className="sign-in-link" href="https://www.va.gov/my-va">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
      <MegaMenu megaMenuData={megaMenuData} />
    </header>
  );
};

DesktopHeader.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
  megaMenuData: PropTypes.array.isRequired,
};

export default DesktopHeader;
