import React from 'react';

import PhoneField from './PhoneField/VAPPhoneField';

import { FIELD_NAMES, FIELD_TITLES } from '../constants';

export default function FaxNumber() {
  return (
    <PhoneField
      title={FIELD_TITLES[FIELD_NAMES.FAX_NUMBER]}
      fieldName={FIELD_NAMES.FAX_NUMBER}
    />
  );
}
