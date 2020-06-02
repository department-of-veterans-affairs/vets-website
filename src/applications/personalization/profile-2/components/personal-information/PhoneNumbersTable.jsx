import React from 'react';

import HomePhone from 'vet360/components/VAPHomePhone';
import WorkPhone from 'vet360/components/VAPWorkPhone';
import MobilePhone from 'vet360/components/VAPMobilePhone';
import FaxNumber from 'vet360/components/VAPFaxNumber';

import ProfileInfoTable from '../ProfileInfoTable';

const PhoneNumbersTable = ({ className }) => (
  <ProfileInfoTable
    title="Phone numbers"
    data={[
      {
        title: 'Home',
        value: <HomePhone />,
      },
      {
        title: 'Work',
        value: <WorkPhone />,
      },
      {
        title: 'Mobile',
        value: <MobilePhone />,
      },
      {
        title: 'Fax',
        value: <FaxNumber />,
      },
    ]}
    list
    className={className}
  />
);

export default PhoneNumbersTable;
