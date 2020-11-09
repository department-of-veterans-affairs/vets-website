import React from 'react';
import PhoneField from './PhoneField';
import { FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';

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
