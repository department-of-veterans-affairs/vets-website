import React from 'react';
import PropTypes from 'prop-types';

import AddressField from './AddressField';

import { FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';

import ProfileInfoTable from '../../ProfileInfoTable';

const AddressesTable = ({ className }) => (
  <ProfileInfoTable
    title="Addresses"
    data={[
      {
        title: 'Mailing address',
        value: (
          <AddressField
            title={FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS]}
            fieldName={FIELD_NAMES.MAILING_ADDRESS}
            deleteDisabled
          />
        ),
      },
      {
        title: 'Home address',
        value: (
          <AddressField
            title={FIELD_TITLES[FIELD_NAMES.RESIDENTIAL_ADDRESS]}
            fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS}
          />
        ),
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
