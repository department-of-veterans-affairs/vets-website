import React from 'react';
import PhoneField from './PhoneField/VAPPhoneField';
import ReceiveTextMessages from '../containers/ReceiveTextMessages';
import { FIELD_NAMES } from '../constants';

export default function MobilePhone() {
  return (
    <>
      <PhoneField
        title="Mobile phone number"
        fieldName={FIELD_NAMES.MOBILE_PHONE}
      />
      <ReceiveTextMessages fieldName={FIELD_NAMES.MOBILE_PHONE} />
    </>
  );
}
