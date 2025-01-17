import React from 'react';

import { HelpTextManage } from '../HelpText';

const NonVeteranAlert = () => {
  return (
    <>
      <va-alert closealble="false" status="warning" role="status" visible>
        <h2 slot="headline">
          We’re sorry, there was a problem retrieving your Travel claims
        </h2>
        <p className="vads-u-margin-y--0">
          Beneficiary Travel on VA.gov is currently supporting Veterans only and
          cannot support Caregiver or other types of accounts at this time.
        </p>
        <HelpTextManage />
      </va-alert>
    </>
  );
};

export default NonVeteranAlert;
