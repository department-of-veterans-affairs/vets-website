import React from 'react';

import PrivacyActStatement from './PrivacyActStatement';

const OmbInfo = () => {
  return (
    <va-omb-info
      res-burden={10}
      omb-number="2900-0262"
      exp-date="08/31/2027"
      id="va-omb-info"
    >
      <PrivacyActStatement />
    </va-omb-info>
  );
};

export default OmbInfo;
