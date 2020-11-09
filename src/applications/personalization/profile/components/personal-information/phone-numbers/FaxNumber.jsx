import React from 'react';

import PhoneField from './PhoneField';

import { FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';

export default function FaxNumber() {
  return (
    <PhoneField
      title={FIELD_TITLES[FIELD_NAMES.FAX_NUMBER]}
      fieldName={FIELD_NAMES.FAX_NUMBER}
    />
  );
}
