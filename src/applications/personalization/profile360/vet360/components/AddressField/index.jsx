import React from 'react';
import pickBy from 'lodash/pickBy';

import {
  API_ROUTES
} from '../../constants';

import { MILITARY_STATES } from '../../../../../letters/utils/constants';

import Vet360ProfileField from '../../containers/ProfileField';

import AddressEditModal from './EditModal';
import AddressView from './View';

function inferAddressType(countryName, stateCode) {
  let addressType = 'DOMESTIC';
  if (countryName !== 'United States') {
    addressType = 'INTERNATIONAL';
  } else if (MILITARY_STATES.has(stateCode)) {
    addressType = 'OVERSEAS MILITARY';
  }

  return addressType;
}

export function cleanEditedData(value) {
  const {
    id,
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    city,
    countryName,
    stateCode,
    zipCode,
    internationalPostalCode,
    province,
  } = value;

  const addressType = inferAddressType(countryName, stateCode);

  return {
    id,
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    addressType,
    city,
    countryName,
    province: addressType === 'INTERNATIONAL' ? province : null,
    stateCode: addressType === 'INTERNATIONAL' ? null : stateCode,
    zipCode: addressType !== 'INTERNATIONAL' ? zipCode : null,
    internationalPostalCode: addressType === 'INTERNATIONAL' ? internationalPostalCode : null,
  };
}

function validateEditedData({ addressLine1, city, stateCode,  internationalPostalCode, zipCode, countryName }, fieldName) {
  const isInternational = inferAddressType(countryName, stateCode) === 'INTERNATIONAL';
  const validateAll = !fieldName;

  return {
    addressLine1: (fieldName === 'addressLine1' || validateAll) && !addressLine1 ? 'Street address is required' : '',
    city: (fieldName === 'city' || validateAll) && !city ? 'City is required' : '',
    stateCode: (fieldName === 'stateCode' || validateAll) && !isInternational && !stateCode ? 'State is required' : '',
    zipCode: (fieldName === 'zipCode' || validateAll) && !isInternational && !zipCode ? 'Zip code is required' : '',
    internationalPostalCode: (fieldName === 'internationalPostalCode' || validateAll) && isInternational && !internationalPostalCode ? 'Postal code is required' : '',
  };
}

function getPayload(addressFormData, fieldName) {
  return pickBy({
    id: addressFormData.id,
    addressLine1: addressFormData.addressLine1,
    addressLine2: addressFormData.addressLine2,
    addressLine3: addressFormData.addressLine3,
    addressType: addressFormData.addressType,
    city: addressFormData.city,
    countryName: addressFormData.countryName,
    stateCode: addressFormData.stateCode,
    internationalPostalCode: addressFormData.internationalPostalCode,
    zipCode: addressFormData.zipCode,
    province: addressFormData.province,
    addressPou: fieldName === 'mailingAddress' ? 'CORRESPONDENCE' : 'RESIDENCE/CHOICE',
  }, e => !!e);
}

export default function Vet360Address({ title, fieldName, deleteDisabled }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      apiRoute={API_ROUTES.ADDRESSES}
      getPayload={getPayload}
      cleanEditedData={cleanEditedData}
      validateEditedData={validateEditedData}
      deleteDisabled={deleteDisabled}
      Content={AddressView}
      EditModal={AddressEditModal}/>
  );
}
