import React from 'react';
import GetGovDeliveryUpdates from './getGovDeliveryUpdates';
import FollowUs from './followUs';

const ConnectWithUs = () => {
  return (
    <va-accordion-item level="3" open="true" header="Connect with us">
      <GetGovDeliveryUpdates />
      <FollowUs />
    </va-accordion-item>
  );
};

export default ConnectWithUs;
