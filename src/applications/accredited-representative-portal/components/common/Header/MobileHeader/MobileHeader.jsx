import React from 'react';

import OfficialGovtWebsite from '../common/OfficialGovtWebsite';
import VeteranCrisisLine from '../common/VeteranCrisisLine';
import MobileLogoRow from './MobileLogoRow';

const MobileHeader = () => {
  return (
    <div
      data-testid="mobile-header"
      className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 mobile"
    >
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <OfficialGovtWebsite isMobile />
      </div>
      <VeteranCrisisLine isMobile />
      <MobileLogoRow />
    </div>
  );
};

export default MobileHeader;
