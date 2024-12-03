import React from 'react';
import { Link } from 'react-router-dom';

export function HelpTextContent() {
  const BTSSS_PORTAL_URL = 'https://dvagov-btsss.dynamics365portals.us/';

  return (
    <p>
      To manage your travel claims or file a new claim, go to our{' '}
      <va-link
        className="btsss-portal-link"
        href={BTSSS_PORTAL_URL}
        text="Beneficiary Travel Self Service System (BTSSS) portal (opens in new tab)"
      />
      .<br />
      Or call <va-telephone contact="8555747292" /> from 7 a.m. to 7 p.m. Monday
      through Friday. Have your claim number ready to share when you call.
      <br />
      <Link
        to={{
          pathname: '/what-does-my-claim-status-mean',
        }}
        className="vads-u-display--flex vads-u-align-items--center"
      >
        What does my claim status mean?
      </Link>
    </p>
  );
}

export default function HelpText() {
  return (
    <div>
      <p>You can use this tool to check the status of your VA travel claims.</p>
      <h2>How to manage your claims or get more information</h2>
      <HelpTextContent />
    </div>
  );
}
