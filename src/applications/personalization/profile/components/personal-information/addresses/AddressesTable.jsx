import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_NAMES } from '@@vap-svc/constants';

import ContactInformationField from '../ContactInformationField';
import ProfileInfoTable from '../../ProfileInfoTable';

const AddressesTable = ({ className }) => (
  <ProfileInfoTable
    title="Addresses"
    data={[
      {
        title: 'Mailing address',
        value: (
          <ContactInformationField fieldName={FIELD_NAMES.MAILING_ADDRESS} />
        ),
      },
      {
        title: 'Home address',
        value: (
          <ContactInformationField
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
