import React from 'react';
import { connect } from 'react-redux';

import { selectVet360Field } from 'platform/user/profile/vet360/selectors';

import PhoneView from 'platform/user/profile/vet360/components/PhoneField/PhoneView';
import { FIELD_NAMES } from 'platform/user/profile/vet360/constants';

import ProfileInfoTable from '../ProfileInfoTable';

const renderValue = value => (value ? <PhoneView data={value} /> : 'not set');

const PhoneNumbersTable = ({
  className,
  homePhone,
  workPhone,
  mobilePhone,
  faxNumber,
}) => (
  <ProfileInfoTable
    title="Phone numbers"
    fieldName="phoneNumber"
    data={[
      {
        title: 'Home',
        value: renderValue(homePhone),
      },
      {
        title: 'Work',
        value: renderValue(workPhone),
      },
      {
        title: 'Mobile',
        value: renderValue(mobilePhone),
      },
      {
        title: 'Fax',
        value: renderValue(faxNumber),
      },
    ]}
    list
    className={className}
  />
);

const mapStateToProps = state => ({
  homePhone: selectVet360Field(state, FIELD_NAMES.HOME_PHONE),
  workPhone: selectVet360Field(state, FIELD_NAMES.WORK_PHONE),
  mobilePhone: selectVet360Field(state, FIELD_NAMES.MOBILE_PHONE),
  faxNumber: selectVet360Field(state, FIELD_NAMES.FAX_NUMBER),
});

export default connect(mapStateToProps)(PhoneNumbersTable);
