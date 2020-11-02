import React from 'react';
import PhoneField from './VAPPhoneField';
import { FIELD_NAMES, FIELD_TITLES } from '@@vet360/constants';

export default function MobilePhone() {
  return (
    <>
      <PhoneField
        title={FIELD_TITLES[FIELD_NAMES.MOBILE_PHONE]}
        fieldName={FIELD_NAMES.MOBILE_PHONE}
      />
    </>
  );
}
