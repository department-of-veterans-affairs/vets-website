import React from 'react';
import { connect } from 'react-redux';

import {
  selectVet360Field,
  // selectVet360Transaction,
  // selectCurrentlyOpenEditModal,
  // selectEditedFormField,
} from 'platform/user/profile/vet360/selectors';

import AddressView from 'platform/user/profile/vet360/components/AddressField/AddressView';
import { FIELD_NAMES } from 'platform/user/profile/vet360/constants';

import ProfileInfoTable from '../ProfileInfoTable';

const renderValue = value => (value ? <AddressView data={value} /> : 'not set');

const AddressesTable = ({ className, homeAddress, mailingAddress }) => (
  <ProfileInfoTable
    title="Addresses"
    data={[
      {
        title: 'Mailing address',
        value: renderValue(mailingAddress),
      },
      {
        title: 'Home address',
        value: renderValue(homeAddress),
      },
    ]}
    className={className}
    list
  />
);

const mapStateToProps = state => ({
  homeAddress: selectVet360Field(state, FIELD_NAMES.RESIDENTIAL_ADDRESS),
  mailingAddress: selectVet360Field(state, FIELD_NAMES.MAILING_ADDRESS),
});

export default connect(mapStateToProps)(AddressesTable);
