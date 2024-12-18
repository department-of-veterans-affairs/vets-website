import React from 'react';
import { Link } from 'react-router-dom';

import { BTSSS_PORTAL_URL } from '../constants';

export default function HelpTextContent() {
  return (
    <div>
      <p>
        To manage your travel claims or file a new claim, go to our{' '}
        <va-link
          external
          href={BTSSS_PORTAL_URL}
          text="Beneficiary Travel Self Service System (BTSSS) portal"
        />
        .
      </p>
      <p className="vads-u-margin-top--2">
        Or call <va-telephone contact="8555747292" /> from 7 a.m. to 7 p.m.
        Monday through Friday. Have your claim number ready to share when you
        call.
      </p>
      <p className="vads-u-margin-top--2">
        <Link
          data-testid="status-explainer-link"
          to={{
            pathname: '/help',
          }}
          className="vads-u-display--flex vads-u-align-items--center"
        >
          What does my claim status mean?
        </Link>
      </p>
    </div>
  );
}
