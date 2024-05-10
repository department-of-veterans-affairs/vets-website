import React from 'react';

const NoPOAPermissionsError = () => (
  <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0 no-poa-permissions-error">
    <div className="vads-l-row">
      <va-alert
        class="arp-full-width-alert"
        data-testid="no-poa-permissions-error"
        status="error"
        visible
      >
        <h2 data-testid="no-poa-permissions-error-heading" slot="headline">
          You do not have permission to manage Power of Attorney Requests
        </h2>
        <div>
          <ul data-testid="no-poa-permissions-error-description">
            <li>
              <span className="arp-full-width-alert__questions">
                Do you have questions about gaining these permissions?{' '}
              </span>
              <a href="mailto:ogcaccreditationmailbox@va.gov">Contact OGC</a>
            </li>
          </ul>
        </div>
      </va-alert>
    </div>
  </div>
);

export default NoPOAPermissionsError;
