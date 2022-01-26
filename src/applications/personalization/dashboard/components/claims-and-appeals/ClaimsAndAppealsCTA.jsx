import React from 'react';
import recordEvent from '~/platform/monitoring/record-event';

import IconCTALink from '../IconCTALink';

const ClaimsAndAppealsCTA = () => {
  return (
    <IconCTALink
      text="Check your claim or appeal status"
      href="/claim-or-appeal-status/"
      icon="clipboard"
      onClick={() => {
        recordEvent({
          event: 'nav-linkslist',
          'links-list-header': 'Check your claim or appeal status',
          'links-list-section-header': 'Claims and appeals',
        });
      }}
    />
  );
};

export default ClaimsAndAppealsCTA;
