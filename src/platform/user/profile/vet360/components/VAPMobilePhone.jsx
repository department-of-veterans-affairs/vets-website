import React from 'react';
import PhoneField from './PhoneField/VAPPhoneField';
import ReceiveTextMessages from '../containers/ReceiveTextMessages';
import { FIELD_NAMES } from '../constants';

export default function MobilePhone({ showReceiveTextNotifications }) {
  return (
    <>
      <PhoneField
        title="Mobile phone number"
        fieldName={FIELD_NAMES.MOBILE_PHONE}
      />
      {showReceiveTextNotifications && (
        <ReceiveTextMessages
          title="Mobile phone number"
          fieldName={FIELD_NAMES.MOBILE_PHONE}
        />
      )}
    </>
  );
}
