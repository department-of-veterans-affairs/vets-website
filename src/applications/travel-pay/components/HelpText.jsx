import React from 'react';

export default function HelpText() {
  const BTSSS_PORTAL_URL = 'https://dvagov-btsss.dynamics365portals.us/';

  return (
    <div slot="content">
      <p>You can use this tool to check the status of your VA travel claims.</p>
      <h2>How to manage your claims or get more information</h2>
      <p>
        To manage your travel claims, file a new claim, or learn what your claim
        status means, go to our{' '}
        <a className="btsss-portal-link" href={BTSSS_PORTAL_URL}>
          Beneficiary Travel Self Service System (BTSSS) portal (opens in new
          tab)
        </a>
        .<br />
        Or call <va-telephone contact="8555747292" /> from 7 a.m. to 7 p.m.
        Monday through Friday. Have your claim number ready to share when you
        call.
      </p>
    </div>
  );
}
