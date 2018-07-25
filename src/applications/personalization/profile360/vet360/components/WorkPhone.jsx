import React from 'react';

import PhoneSection from '../../components/PhoneSection';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function WorkPhone() {
  return (
    <PhoneSection
      title="Work phone number"
      fieldName={FIELD_NAMES.WORK_PHONE}/>
  );
}
