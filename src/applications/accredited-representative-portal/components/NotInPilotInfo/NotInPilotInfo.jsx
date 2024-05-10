import React from 'react';

const NotInPilotInfo = () => (
  <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0">
    <div className="vads-l-row">
      <va-alert
        class="arp-full-width-alert"
        data-testid="not-in-pilot-Info"
        status="info"
        visible
      >
        <h2 data-testid="not-in-pilot-Info-heading" slot="headline">
          Accredited Representative Portal is currently in pilot
        </h2>
        <div>
          {/* TODO: Add email addresses */}
          <ul data-testid="not-in-pilot-Info-description">
            <li>
              <span className="arp-full-width-alert__questions">
                Would you like to join the pilot?{' '}
              </span>
              <a href="mailto:addAnEmail@va.gov">Contact add org here</a>
            </li>
            <li>
              <span className="arp-full-width-alert__questions">
                Do you need help with SEP and other VA digital tools?{' '}
              </span>
              <a href="mailto:addAnEmail@va.gov">Contact add org here</a>
            </li>
            <li>
              <span className="arp-full-width-alert__questions">
                Do you have questions about the accreditation process?{' '}
              </span>
              <a href="mailto:ogcaccreditationmailbox@va.gov">Contact OGC</a>
            </li>
          </ul>
        </div>
      </va-alert>
    </div>
  </div>
);

export default NotInPilotInfo;
