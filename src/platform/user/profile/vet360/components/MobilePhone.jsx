import React from 'react';
import PhoneField from './PhoneField';
import ReceiveTextMessages from '../containers/ReceiveTextMessages';
import { FIELD_NAMES } from '../constants';
import featureFlags from '../featureFlags';

export default function MobilePhone() {
  return (
    <>
      <PhoneField
        title="Mobile phone number"
        fieldName={FIELD_NAMES.MOBILE_PHONE}
      />
      {featureFlags.receiveTextMessages && (
        <ReceiveTextMessages
          title="Mobile phone number"
          fieldName={FIELD_NAMES.MOBILE_PHONE}
        />
      )}
    </>
  );
}
