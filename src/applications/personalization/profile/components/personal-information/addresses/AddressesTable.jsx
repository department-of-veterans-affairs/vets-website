import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ContactInformationField from '@@vap-svc/components/ContactInformationField';

import ProfileInfoTable from '../../ProfileInfoTable';

const AddressesTable = ({ className }) => (
  <ProfileInfoTable
    title="Addresses"
    level={2}
    namedAnchor="addresses"
    data={[
      {
        title: 'Mailing address',
        id: FIELD_IDS[FIELD_NAMES.MAILING_ADDRESS],
        value: (
          <ContactInformationField fieldName={FIELD_NAMES.MAILING_ADDRESS} />
        ),
      },
      {
        title: 'Home address',
        id: FIELD_IDS[FIELD_NAMES.RESIDENTIAL_ADDRESS],
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
