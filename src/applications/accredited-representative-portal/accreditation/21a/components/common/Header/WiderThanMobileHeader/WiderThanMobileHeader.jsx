import React from 'react';

import WiderThanMobileLogoRow from './WiderThanMobileLogoRow';
import WiderThanMobileOfficialGovtWebsite from './WiderThanMobileOfficialGovtWebsite';

const WiderThanMobileHeader = () => {
  return (
    <div data-testid="wider-than-mobile-header" className="wider-than-mobile">
      <div className="va-notice--banner">
        <div className="va-notice--banner-inner">
          <WiderThanMobileOfficialGovtWebsite />
        </div>
      </div>
      <WiderThanMobileLogoRow />
    </div>
  );
};

export default WiderThanMobileHeader;
