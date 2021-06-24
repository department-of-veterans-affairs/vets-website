import React from 'react';
import Breadcrumbs from '../Breadcrumbs';
import InfoAlert from '../InfoAlert';

export default function AppUnavailable() {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
      <Breadcrumbs />
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
          <InfoAlert
            status="warning"
            headline="We’re sorry, the new VA online scheduling application isn’t available right now"
            className="vads-u-margin-top--0"
          >
            If you need to schedule an appointment, please contact your{' '}
            <a href="/find-locations">nearest VA facility</a>.
          </InfoAlert>
        </div>
      </div>
    </div>
  );
}
