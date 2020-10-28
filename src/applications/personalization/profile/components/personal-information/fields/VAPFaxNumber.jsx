import React from 'react';

import PhoneField from './VAPPhoneField';

import {
  FIELD_NAMES,
  FIELD_TITLES,
} from 'platform/user/profile/vet360/constants';

export default function FaxNumber() {
  return (
    <PhoneField
      title={FIELD_TITLES[FIELD_NAMES.FAX_NUMBER]}
      fieldName={FIELD_NAMES.FAX_NUMBER}
    />
  );
}
