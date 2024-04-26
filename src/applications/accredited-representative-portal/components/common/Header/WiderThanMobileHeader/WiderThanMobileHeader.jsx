import React from 'react';

import WiderThanMobileLogoRow from './WiderThanMobileLogoRow';
import WiderThanMobileMenu from './WiderThanMobileMenu';
import OfficialGovtWebsite from '../common/OfficialGovtWebsite';
import VeteranCrisisLine from '../common/VeteranCrisisLine';

const WiderThanMobileHeader = () => {
  return (
    <div data-testid="wider-than-mobile-header" className="wider-than-mobile">
      <div className="va-notice--banner">
        <div className="va-notice--banner-inner">
          <OfficialGovtWebsite />
        </div>
        <VeteranCrisisLine />
      </div>
      <WiderThanMobileLogoRow />
      <WiderThanMobileMenu />
    </div>
  );
};

export default WiderThanMobileHeader;
