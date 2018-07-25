import React from 'react';

import PhoneSection from '../../components/PhoneSection';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function FaxNumber() {
  return (
    <PhoneSection
      title="Fax number"
      fieldName={FIELD_NAMES.FAX_NUMBER}
      analyticsSectionName="fax-telephone"/>
  );
}
