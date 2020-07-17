import React from 'react';

import EmailField from './EmailField/VAPEmailField';

import { FIELD_NAMES, FIELD_TITLES } from '../constants';

export default function Email() {
  return (
    <EmailField
      title={FIELD_TITLES[FIELD_NAMES.EMAIL]}
      fieldName={FIELD_NAMES.EMAIL}
    />
  );
}
