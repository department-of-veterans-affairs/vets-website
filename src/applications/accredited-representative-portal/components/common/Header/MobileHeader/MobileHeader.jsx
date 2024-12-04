import React from 'react';

import MobileOfficialGovtWebsite from './MobileOfficialGovtWebsite';
import MobileLogoRow from './MobileLogoRow';

const MobileHeader = () => {
  return (
    <div data-testid="header">
      <MobileOfficialGovtWebsite />
      <MobileLogoRow />
    </div>
  );
};

export default MobileHeader;
