import React from 'react';

export default function DemoModeBanner() {
  return (
    <>
      {/* <va-banner
        data-label="Info banner"
        headline="You are about to enter a Demo"
        type="error"
        visible
      >
        <p>
          The MyHealtheVet Demo Mode is intended for educational and training
          purposes only
        </p>
      </va-banner> */}
      <va-maintenance-banner
        banner-id="maintenance-banner"
        is-error
        maintenance-end-date-time="Sun Jun 21 2099 04:30:00 GMT-0700 (Pacific Daylight Time)"
        maintenance-start-date-time="Sun Jun 21 2099 00:00:00 GMT-0700 (Pacific Daylight Time)"
        maintenance-title="Site maintenance"
        maintenance-title-header-level={2}
        upcoming-warn-start-date-time="Mon Jan 26 2026 09:29:55 GMT-0800 (Pacific Standard Time)"
        upcoming-warn-title="You are about to enter a Demo"
      >
        <div slot="warn-content">
          <span>
            The MyHealtheVet Demo Mode is intended for educational and training
            purposes only
          </span>
        </div>
        <div slot="maintenance-content">
          We’re working on VA.gov right now. If you have trouble signing in or
          using tools, check back after we’re finished. Thank you for your
          patience.
        </div>
      </va-maintenance-banner>
    </>
  );
}
