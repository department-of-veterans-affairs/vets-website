import React from 'react';

import PhoneSection from '../../components/PhoneSection';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function HomePhone() {
  return (
    <PhoneSection
      title="Home phone number"
      fieldName={FIELD_NAMES.HOME_PHONE}/>
  );
}
