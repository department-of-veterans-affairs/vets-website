import React from 'react';

import PhoneField from './PhoneField/VAPPhoneField';

import { FIELD_NAMES } from '../constants';

export default function HomePhone() {
  return (
    <PhoneField title="Home phone number" fieldName={FIELD_NAMES.HOME_PHONE} />
  );
}
