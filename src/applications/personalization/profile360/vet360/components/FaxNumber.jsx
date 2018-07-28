import React from 'react';

import PhoneField from './PhoneField';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function FaxNumber() {
  return (
    <PhoneField
      title="Fax number"
      fieldName={FIELD_NAMES.FAX_NUMBER}/>
  );
}
