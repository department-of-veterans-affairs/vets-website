import React from 'react';
import PhoneField from './PhoneField/PhoneField';
import ReceiveTextMessages from '../containers/ReceiveTextMessages';
import { FIELD_NAMES } from '../constants';

export default function MobilePhone() {
  return (
    <>
      <PhoneField
        title="Mobile phone number"
        fieldName={FIELD_NAMES.MOBILE_PHONE}
      />
      <ReceiveTextMessages
        title="Mobile phone number"
        fieldName={FIELD_NAMES.MOBILE_PHONE}
      />
    </>
  );
}
