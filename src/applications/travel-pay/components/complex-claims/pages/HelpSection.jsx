import React from 'react';

import { FIND_FACILITY_TP_CONTACT_LINK } from '../../../constants';

const HelpSection = () => {
  return (
    <div className="complex-claim-help-section vads-u-margin--2">
      <h2 className="complex-claim-help-heading">Need help?</h2>
      <p className="vads-u-margin-top--0">
        You can call the BTSSS call center at{' '}
        <va-telephone contact="8555747292" /> (
        <va-telephone tty contact="711" />) We’re here Monday through Friday,
        8:00 a.m. to 8:00 p.m. ET. Have your claim number ready to share when
        you call.
      </p>
      <p>Or call your VA health facility’s Beneficiary Travel contact.</p>
      <va-link
        href={FIND_FACILITY_TP_CONTACT_LINK}
        text="Find the travel contact for your facility"
      />
    </div>
  );
};

export default HelpSection;
