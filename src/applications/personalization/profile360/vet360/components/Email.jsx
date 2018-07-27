import React from 'react';

import EmailSection from '../../components/EmailSection';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function Email() {
  return (
    <EmailSection
      title="Email address"
      fieldName={FIELD_NAMES.EMAIL}/>
  );
}
