import React from 'react';
import VeteranStatus from './VeteranStatus';

import Headline from '../ProfileSectionHeadline';

const VeteranStatusCardPage = () => {
  return (
    <>
      <Headline>Veteran Status Card</Headline>
      <p className="veteran-status-description">
        This card makes it easy to prove your service and access Veteran
        discounts, all while keeping your personal information secure.
      </p>
      <VeteranStatus />
    </>
  );
};

export default VeteranStatusCardPage;
