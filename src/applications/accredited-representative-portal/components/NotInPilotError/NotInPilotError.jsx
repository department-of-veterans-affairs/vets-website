import React from 'react';

const NotInPilotError = () => (
  <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0">
    <div className="vads-l-row">
      <va-alert data-testid="not-in-pilot-error" status="error" visible>
        <h2 data-testid="not-in-pilot-error-heading" slot="headline">
          Accredited Representative Portal is currently in pilot and not
          available to all users.
        </h2>
        <div>
          <p
            data-testid="not-in-pilot-error-description"
            className="vads-u-margin-y--0"
          >
            To reach out to the team managing the pilot, please email...
          </p>
        </div>
      </va-alert>
    </div>
  </div>
);

export default NotInPilotError;
