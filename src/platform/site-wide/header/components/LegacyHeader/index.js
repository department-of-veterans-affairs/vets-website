// Node modules.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import MegaMenu from '../../../mega-menu/containers/Main';
import MobileMenuButton from '../../../mobile-menu-button/containers/Main';
import UserNav from '../../../user-nav/containers/Main';
import recordEvent from 'platform/monitoring/record-event';

export const LegacyHeader = ({ megaMenuData, showMegaMenu, showNavLogin }) => {
  const [showGovtWebsiteSection, setShowGovtWebsiteSection] = useState(false);

  return (
    <>
      {/* Browser Out of Date Warning */}
      <div className="incompatible-browser-warning">
        <div className="row full">
          <div className="small-12">
            Your browser is out of date. To use this website, please{' '}
            <a
              aria-label="Update your browser (opens in new window)"
              href="https://browsehappy.com/"
              rel="noreferrer noopener"
              target="_blank"
            >
              update your browser
            </a>{' '}
            or use a different device.
          </div>
        </div>
      </div>

      {/* Top mini banners */}
      <div className="va-notice--banner">
        <div className="va-notice--banner-inner">
          <div className="usa-banner">
            <div className="usa-accordion">
              {/* Official government website mini banner */}
              <div
                className={`usa-banner-header${
                  showGovtWebsiteSection ? ' usa-banner-header-expanded' : ''
                }`}
              >
                <div className="usa-grid usa-banner-inner">
                  <img src="/img/tiny-usa-flag.png" alt="U.S. flag" />
                  <p>An official website of the United States government</p>
                  <button
                    aria-controls="gov-banner"
                    aria-expanded="false"
                    className="usa-accordion-button usa-banner-button"
                    id="usa-banner-toggle"
                    onMouseUp={() =>
                      setShowGovtWebsiteSection(!showGovtWebsiteSection)
                    }
                    onKeyDown={event =>
                      event.keyCode === 13 &&
                      setShowGovtWebsiteSection(!showGovtWebsiteSection)
                    }
                  >
                    <span className="usa-banner-button-text">
                      Here’s how you know
                    </span>
                  </button>
                </div>
              </div>

              {/* Official government website expanded section */}
              <div
                className="usa-banner-content usa-grid usa-accordion-content"
                id="gov-banner"
                aria-hidden={showGovtWebsiteSection ? 'false' : 'true'}
              >
                {/* Domain name notice */}
                <div className="usa-banner-guidance-gov usa-width-one-half">
                  <img
                    className="usa-banner-icon usa-media_block-img"
                    src="/img/icon-dot-gov.svg"
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

                {/* SSL certificate notice */}
                <div className="usa-banner-guidance-ssl usa-width-one-half">
                  <img
                    className="usa-banner-icon usa-media_block-img"
                    src="/img/icon-https.svg"
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

        {/* Veteran Crisis Line banner */}
        <div className="va-crisis-line-container">
          <button
            className="va-crisis-line va-overlay-trigger"
            data-show="#modal-crisisline"
            onClick={() => recordEvent({ event: 'nav-crisis-header' })}
          >
            <div className="va-crisis-line-inner">
              <span className="va-crisis-line-icon" aria-hidden="true" />
              <span
                className="va-crisis-line-text"
                onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
              >
                Talk to the <strong>Veterans Crisis Line</strong> now
              </span>
              <img
                alt="right arrow white"
                aria-hidden="true"
                className="va-crisis-line-arrow"
                src="/img/arrow-right-white.svg"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Main header */}
      <div
        className="row va-flex usa-grid usa-grid-full"
        id="va-header-logo-menu"
      >
        {/* Logo */}
        <div className="va-header-logo-wrapper">
          <a href="/" className="va-header-logo">
            <img src="/img/header-logo.png" alt="Go to VA.gov" />
          </a>
        </div>

        {showNavLogin && (
          <>
            {/* Nav controls */}
            <div id="va-nav-controls">
              <MobileMenuButton />
            </div>

            {/* Mobile mega menu */}
            {showMegaMenu && (
              <div className="medium-screen:vads-u-display--none usa-grid usa-grid-full">
                <div className="menu-rule usa-one-whole" />
                <div className="mega-menu" id="mega-menu-mobile" />
              </div>
            )}

            {/* Login */}
            <div id="login-root" className="vet-toolbar">
              <UserNav />
            </div>
          </>
        )}
      </div>

      {/* Mega menu */}
      {showMegaMenu && (
        <div className="usa-grid usa-grid-full">
          <div className="menu-rule usa-one-whole" />
          <div className="mega-menu" id="mega-menu">
            <MegaMenu megaMenuData={megaMenuData} />
          </div>
        </div>
      )}
    </>
  );
};

LegacyHeader.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default LegacyHeader;
