import React from 'react';
import environment from 'platform/utilities/environment';
import PhoneField from './PhoneField';
import ReceiveTextMessages from '../containers/ReceiveTextMessages';
import { FIELD_NAMES } from '../constants';

export default function MobilePhone() {
  return (
    <>
      <PhoneField
        title="Mobile phone number"
        fieldName={FIELD_NAMES.MOBILE_PHONE}
      />
      {!environment.isProduction() && (
        <ReceiveTextMessages
          title="Mobile phone number"
          fieldName={FIELD_NAMES.MOBILE_PHONE}
        />
      )}
    </>
  );
}
