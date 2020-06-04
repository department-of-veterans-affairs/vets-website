import React from 'react';

import MailingAddress from 'platform/user/profile/vet360/components/VAPMailingAddress';
import ResidentialAddress from 'platform/user/profile/vet360/components/VAPResidentialAddress';

import ProfileInfoTable from '../ProfileInfoTable';

const AddressesTable = ({ className }) => (
  <ProfileInfoTable
    title="Addresses"
    data={[
      {
        title: 'Mailing address',
        value: <MailingAddress />,
      },
      {
        title: 'Home address',
        value: <ResidentialAddress />,
      },
    ]}
    className={className}
    list
  />
);

export default AddressesTable;
