import React from 'react';

import PhoneField from './PhoneField';

import { FIELD_NAMES } from '../constants';

export default function FaxNumber() {
  return <PhoneField title="Fax number" fieldName={FIELD_NAMES.FAX_NUMBER} />;
}
