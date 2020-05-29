import React from 'react';

import EmailField from './EmailField/VAPEmailField';

import { FIELD_NAMES } from '../constants';

export default function Email() {
  return <EmailField title="Email address" fieldName={FIELD_NAMES.EMAIL} />;
}
