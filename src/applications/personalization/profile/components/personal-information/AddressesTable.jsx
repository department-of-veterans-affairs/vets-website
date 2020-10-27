import React from 'react';
import PropTypes from 'prop-types';

import MailingAddress from './fields/VAPMailingAddress';
import ResidentialAddress from './fields/VAPResidentialAddress';

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

AddressesTable.propTypes = {
  className: PropTypes.string,
};

export default AddressesTable;
