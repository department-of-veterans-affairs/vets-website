import React from 'react';

import EmailField from 'platform/user/profile/vet360/components/EmailField/VAPEmailField';

import {
  FIELD_NAMES,
  FIELD_TITLES,
} from 'platform/user/profile/vet360/constants';

export default function Email() {
  return (
    <EmailField
      title={FIELD_TITLES[FIELD_NAMES.EMAIL]}
      fieldName={FIELD_NAMES.EMAIL}
    />
  );
}
