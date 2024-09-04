import React, { useState } from 'react';

const WiderThanMobileOfficialGovtWebsite = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="usa-banner">
      <div className="usa-accordion">
        <div className="usa-banner-header">
          <div className="usa-grid usa-banner-inner">
            <img
              src="/img/tiny-usa-flag.png"
              alt="U.S. flag"
              height="20"
              width="20"
            />

            <p>An official website of the United States government</p>
            {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
            <button
              data-testid="official-govt-website-toggle-wider-than-mobile"
              className="usa-accordion-button usa-banner-button"
              aria-expanded={isExpanded}
              aria-controls="gov-banner"
              onClick={toggleExpansion}
            >
              <span
                data-testid="official-govt-website-toggle-wider-than-mobile-text"
                className="usa-banner-button-text"
              >
                Here’s how you know
              </span>
            </button>
          </div>
        </div>
        <div
          data-testid="official-govt-website-content-wider-than-mobile"
          className="usa-banner-content usa-grid usa-accordion-content"
          aria-hidden={!isExpanded}
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
                Federal government websites often end in .gov or .mil. Before
                sharing sensitive information, make sure you’re on a federal
                government site.
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
                connecting to the official website and that any information you
                provide is encrypted and sent securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WiderThanMobileOfficialGovtWebsite;
