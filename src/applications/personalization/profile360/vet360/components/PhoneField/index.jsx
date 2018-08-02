import React from 'react';
import pickBy from 'lodash/pickBy';

import {
  API_ROUTES,
  PHONE_TYPE
} from '../../constants';

import { isValidPhone } from '../../../../../../platform/forms/validations';

import Vet360ProfileField from '../../containers/ProfileField';

import PhoneEditModal from './EditModal';
import PhoneView from './View';

function cleanEditedData(value) {
  const {
    id,
    countryCode,
    extension,
    phoneType,
    inputPhoneNumber,
  } = value;

  const strippedPhone = (inputPhoneNumber || '').replace(/[^\d]/g, '');
  const strippedExtension = (extension || '').replace(/[^a-zA-Z0-9]/g, '');

  return {
    id,
    areaCode: strippedPhone.substring(0, 3),
    countryCode,
    extension: strippedExtension,
    phoneType,
    phoneNumber: strippedPhone.substring(3),
    isInternational: countryCode !== '1',
    inputPhoneNumber,
  };
}

function validateEditedData({ inputPhoneNumber }) {
  return {
    inputPhoneNumber: inputPhoneNumber && isValidPhone(inputPhoneNumber) ? '' : 'Please enter a valid phone.'
  };
}

function getPayload(phoneFormData, fieldName) {
  // strip falsy values like '', null so vet360 does not reject
  return pickBy({
    id: phoneFormData.id,
    areaCode: phoneFormData.areaCode,
    countryCode: '1', // currently no international phone number support
    extension: phoneFormData.extension,
    phoneNumber: phoneFormData.phoneNumber,
    isInternational: false, // currently no international phone number support
    phoneType: PHONE_TYPE[fieldName],
  }, e => !!e);
}

export default function Vet360Phone({ title, fieldName }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      apiRoute={API_ROUTES.TELEPHONES}
      validateEditedData={validateEditedData}
      getPayload={getPayload}
      cleanEditedData={cleanEditedData}
      Content={PhoneView}
      EditModal={PhoneEditModal}/>
  );
}
