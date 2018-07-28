import React from 'react';

import PhoneField from './PhoneField';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function HomePhone() {
  return (
    <PhoneField
      title="Home phone number"
      fieldName={FIELD_NAMES.HOME_PHONE}/>
  );
}
