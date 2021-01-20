import React from 'react';
import { PHONE_TYPE, USA } from '@@vap-svc/constants';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import pickBy from 'lodash/pickBy';

export const phoneFormSchema = {
  type: 'object',
  properties: {
    'view:noInternationalNumbers': {
      type: 'object',
      properties: {},
    },
    inputPhoneNumber: {
      type: 'string',
      pattern: '^\\d{10}$',
    },
    extension: {
      type: 'string',
      pattern: '^\\s*[a-zA-Z0-9]{0,10}\\s*$',
    },
    isTextPermitted: {
      type: 'boolean',
    },
  },
  required: ['inputPhoneNumber'],
};

export const phoneUiSchema = {
  'view:noInternationalNumbers': {
    'ui:description': () => (
      <AlertBox
        isVisible
        status="info"
        className="vads-u-margin-bottom--3 vads-u-margin-top--1 medium-screen:vads-u-margin-top--0"
      >
        <p>
          We can only support U.S. phone numbers right now. If you have an
          international number, please check back later.
        </p>
      </AlertBox>
    ),
  },
  inputPhoneNumber: {
    'ui:widget': PhoneNumberWidget,
    'ui:title': 'Number',
    'ui:errorMessages': {
      pattern: 'Please enter a valid phone number.',
    },
  },
  extension: {
    'ui:title': 'Extension',
    'ui:errorMessages': {
      pattern: 'Please enter a valid extension.',
    },
  },
  isTextPermitted: {
    'ui:title':
      'Send me text message (SMS) reminders for my VA health care appointments',
    'ui:options': {
      hideIf: formData => !formData['view:showSMSCheckbox'],
    },
  },
};

export const phoneConvertNextValueToCleanData = value => {
  const {
    id,
    countryCode,
    extension,
    phoneType,
    inputPhoneNumber,
    isTextable,
    isTextPermitted,
  } = value;

  const strippedPhone = (inputPhoneNumber || '').replace(/[^\d]/g, '');
  const strippedExtension = (extension || '').replace(/[^a-zA-Z0-9]/g, '');

  return {
    id,
    areaCode: strippedPhone.substring(0, 3),
    countryCode,
    extension: strippedExtension,
    inputPhoneNumber,
    isInternational: countryCode !== USA.COUNTRY_CODE,
    isTextable,
    isTextPermitted,
    phoneNumber: strippedPhone.substring(3),
    phoneType,
  };
};

export const phoneConvertCleanDataToPayload = (data, fieldName) => {
  let cleanData = data;
  if (data.inputPhoneNumber) {
    cleanData = phoneConvertNextValueToCleanData(data);
  }
  return pickBy(
    {
      id: cleanData.id,
      areaCode: cleanData.areaCode,
      countryCode: USA.COUNTRY_CODE, // currently no international phone number support
      extension: cleanData.extension,
      isInternational: false, // currently no international phone number support
      isTextable: cleanData.isTextable,
      isTextPermitted: cleanData.isTextPermitted,
      phoneNumber: cleanData.phoneNumber,
      phoneType: PHONE_TYPE[fieldName],
    },
    e => !!e,
  );
};
