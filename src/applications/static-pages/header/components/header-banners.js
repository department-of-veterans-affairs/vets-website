import React from 'react';

const HeaderBanners = () => {
  return (
    <div className="va-notice--banner">
      <div className="va-notice--banner-inner">
        <div className="usa-banner">
          <div className="usa-accordion">
            <div className="usa-banner-header">
              <div className="usa-grid usa-banner-inner">
                <img src="/img/tiny-usa-flag.png" alt="U.S. flag" />
                <button
                  id="usa-banner-toggle"
                  className="usa-accordion-button usa-banner-button"
                  aria-expanded="false"
                  aria-controls="gov-banner"
                >
                  <span className="usa-banner-button-text">
                    An official website of the United States government
                  </span>
                </button>
              </div>
            </div>
            <div
              className="usa-banner-content usa-grid usa-accordion-content"
              id="gov-banner"
              aria-hidden="true"
            >
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
                    Before sharing sensitive information, make sure you’re on a
                    federal government site.
                  </p>
                </div>
              </div>
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
                    connecting to the official website and that any information
                    you provide is encrypted and sent securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="va-crisis-line-container">
        <button
          onClick="recordEvent({ event: 'nav-crisis-header' })"
          data-show="#modal-crisisline"
          className="va-crisis-line va-overlay-trigger"
        >
          <div className="va-crisis-line-inner">
            <span
              className="va-crisis-line-text"
              onClick="recordEvent({ event: 'nav-jumplink-click' });"
            >
              Talk to the <strong>Veterans Crisis Line</strong> now
            </span>
            <img
              className="va-crisis-line-arrow"
              src="/img/arrow-right-white.svg"
              aria-hidden="true"
              alt=""
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default HeaderBanners;
