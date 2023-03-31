import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

const recordActionLinkClick = () => {
  recordEvent({
    event: 'cta-action-link-click',
    'action-link-type': 'primary',
    'action-link-click-label': 'Go to BTSSS to file a claim',
    'action-link-icon-color': 'green',
  });
};

const AuthContext = () => (
  <>
    <a
      className="vads-c-action-link--green"
      href="https://dvagov-btsss.dynamics365portals.us/signin"
      onClick={recordActionLinkClick}
    >
      Go to BTSSS to file a claim
    </a>
  </>
);

export default AuthContext;
