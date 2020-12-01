import React from 'react';
import PropTypes from 'prop-types';

import AddressField from 'platform/user/profile/vap-svc/components/AddressField/AddressField.jsx';
import { FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInfoTable from '../../ProfileInfoTable';

const AddressesTable = ({ className }) => (
  <ProfileInfoTable
    title="Addresses"
    data={[
      {
        title: 'Mailing address',
        value: (
          <AddressField
            fieldName={FIELD_NAMES.MAILING_ADDRESS}
            deleteDisabled
          />
        ),
      },
      {
        title: 'Home address',
        value: <AddressField fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS} />,
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
