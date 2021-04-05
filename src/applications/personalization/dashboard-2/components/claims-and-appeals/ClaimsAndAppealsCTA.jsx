import React from 'react';

import IconCTALink from '../IconCTALink';

const ClaimsAndAppealsCTA = () => {
  return (
    <div className="vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--4 medium-screen:vads-u-padding-right--3">
      <IconCTALink
        text="Manage all your claims and appeals"
        href="claim-or-appeal-status/"
        icon="clipboard"
      />
    </div>
  );
};

export default ClaimsAndAppealsCTA;
