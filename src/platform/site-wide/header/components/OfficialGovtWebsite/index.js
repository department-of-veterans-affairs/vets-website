/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import recordEvent from '~/platform/monitoring/record-event';

export const OfficialGovtWebsite = () => {
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
        <va-button
          aria-controls="official-govt-site-explanation"
          aria-expanded={expanded ? 'true' : 'false'}
          className="expand-official-govt-explanation va-button-link vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center"
          text="An official website of the United States government."
          onClick={onToggle}
        />
      </div>
      {/* Expanded section */}
      {expanded && (
        <div
          aria-hidden={expanded ? 'false' : 'true'}
          className="usa-banner-content vads-grid-container usa-accordion-content vads-u-background-color--gray-lightest"
          id="official-govt-site-explanation"
        >
          <div className="vads-grid-row">
            <div className="usa-media-block desktop-lg:vads-grid-col-6">
              <img
                alt="Dot gov"
                className="usa-banner-icon usa-media_block-img"
                src="https://www.va.gov/img/icon-dot-gov.svg"
              />
              <p className="usa-media-block__body vads-u-margin-top--0">
                <strong>The .gov means it’s official.</strong>
                <br />
                Federal government websites often end in .gov or .mil. Before
                sharing sensitive information, make sure you’re on a federal
                government site.
              </p>
            </div>
            <div className="usa-media-block desktop-lg:vads-grid-col-6">
              <img
                alt="SSL"
                className="usa-banner-icon usa-media_block-img"
                src="https://www.va.gov/img/icon-https.svg"
              />
              <p className="usa-media-block__body vads-u-margin-top--0">
                <strong>The site is secure.</strong>
                <br /> The <strong>https://</strong> ensures that you’re
                connecting to the official website and that any information you
                provide is encrypted and sent securely.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialGovtWebsite;
