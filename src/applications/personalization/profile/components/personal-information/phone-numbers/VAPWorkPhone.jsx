import React from 'react';

import PhoneField from './VAPPhoneField';

import { FIELD_NAMES, FIELD_TITLES } from '@@vet360/constants';

export default function WorkPhone() {
  return (
    <PhoneField
      title={FIELD_TITLES[FIELD_NAMES.WORK_PHONE]}
      fieldName={FIELD_NAMES.WORK_PHONE}
    />
  );
}
