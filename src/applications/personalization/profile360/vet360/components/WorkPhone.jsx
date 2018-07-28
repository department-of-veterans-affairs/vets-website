import React from 'react';

import PhoneField from './PhoneField';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function WorkPhone() {
  return (
    <PhoneField
      title="Work phone number"
      fieldName={FIELD_NAMES.WORK_PHONE}/>
  );
}
