import React from 'react';

import PhoneSection from '../../components/PhoneSection';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function MobilePhone() {
  return (
    <PhoneSection
      title="Mobile phone number"
      fieldName={FIELD_NAMES.MOBILE_PHONE}/>
  );
}
