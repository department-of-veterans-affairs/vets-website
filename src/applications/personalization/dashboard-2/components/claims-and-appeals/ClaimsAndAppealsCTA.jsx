import React from 'react';

import IconCTALink from '../IconCTALink';

const ClaimsAndAppealsCTA = ({ count }) => {
  let content = 'Manage all your claims and appeals';
  if (count === 1) {
    content = '1 claim or appeal in progress';
  } else if (count > 1) {
    content = `${count} claims or appeals in progress`;
  }

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--4 medium-screen:vads-u-padding-right--3">
      <IconCTALink
        text={content}
        href="claim-or-appeal-status/"
        icon="clipboard"
      />
    </div>
  );
};

export default ClaimsAndAppealsCTA;
