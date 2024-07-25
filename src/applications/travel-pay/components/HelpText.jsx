import React from 'react';

export default function HelpText() {
  const BTSSS_PORTAL_URL = 'https://dvagov-btsss.dynamics365portals.us/';

  return (
    <div slot="content">
      <p>
        If you need to manage a claim, log into the{' '}
        <a className="btsss-portal-link" href={BTSSS_PORTAL_URL}>
          BTSSS portal
          <va-icon
            aria-hidden="true"
            className="vads-u-margin-left--2p5"
            icon="launch"
            size={2}
          />
        </a>{' '}
        or call <va-telephone contact="8555747292" /> from 7 a.m. to 7 p.m.
        Monday through Friday. Have your claim number ready to share when you
        call.
      </p>
    </div>
  );
}
