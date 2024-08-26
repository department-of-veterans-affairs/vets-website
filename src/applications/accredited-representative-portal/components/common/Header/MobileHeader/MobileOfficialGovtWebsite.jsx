/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import recordEvent from '~/platform/monitoring/record-event';

export const MobileOfficialGovtWebsite = () => {
  const [expanded, setExpanded] = useState(false);

  const onToggle = () => {
    if (expanded) {
      recordEvent({ event: 'int-accordion-collapse' });
    } else {
      recordEvent({ event: 'int-accordion-expand' });
    }

    setExpanded(!expanded);
  };

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      {/* Banner */}
      <div className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-text-align--center vads-u-padding--0p5">
        <img
          alt="U.S. flag"
          className="header-us-flag vads-u-margin-right--1"
          src="https://www.va.gov/img/tiny-usa-flag.png"
        />
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
        <button
          data-testid="official-govt-website-toggle-mobile"
          aria-controls="official-govt-site-explanation"
          aria-expanded={expanded ? 'true' : 'false'}
          className="expand-official-govt-explanation va-button-link vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center"
          onClick={onToggle}
        >
          An official website of the United States government.
          <svg
            aria-hidden="true"
            className={`vads-u-margin-left--0p5${
              expanded ? ' govt-expanded-arrow' : ''
            }`}
            focusable="false"
            width="12"
            viewBox="6 6 12 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#005ea2"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z"
            />
          </svg>
        </button>
      </div>
      {/* Expanded section */}
      {expanded && (
        <div
          data-testid="official-govt-website-content-mobile"
          aria-hidden={expanded ? 'false' : 'true'}
          className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-padding--1p5 vads-u-padding-y--2"
          id="official-govt-site-explanation"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--flex-start">
            <img
              alt="Dot gov"
              className="usa-banner-icon usa-media_block-img"
              src="https://www.va.gov/img/icon-dot-gov.svg"
            />
            <p className="vads-u-margin-top--0">
              <strong>The .gov means it’s official.</strong>
              <br />
              Federal government websites often end in .gov or .mil. Before
              sharing sensitive information, make sure you’re on a federal
              government site.
            </p>
          </div>
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--flex-start vads-u-margin-top--2">
            <img
              alt="SSL"
              className="usa-banner-icon usa-media_block-img"
              src="https://www.va.gov/img/icon-https.svg"
            />
            <p className="vads-u-margin-top--0">
              <strong>The site is secure.</strong>
              <br /> The <strong>https://</strong> ensures that you’re
              connecting to the official website and that any information you
              provide is encrypted and sent securely.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOfficialGovtWebsite;
