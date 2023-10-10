import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';

import {
  API_ROUTES,
  FIELD_NAMES,
  ADDRESS_FORM_VALUES,
  ADDRESS_TYPES,
  ADDRESS_POU,
  USA,
} from 'platform/user/profile/vap-svc/constants';

import VAPServiceProfileField from '~/platform/user/profile/vap-svc/containers/VAPServiceProfileField';

import AddressView from './AddressView';

import { getFormSchema, getUiSchema } from './address-schemas';

export const inferAddressType = (countryCodeIso3, stateCode) => {
  let addressType = ADDRESS_TYPES.DOMESTIC;
  if (countryCodeIso3 !== USA.COUNTRY_ISO3_CODE) {
    addressType = ADDRESS_TYPES.INTERNATIONAL;
  } else if (ADDRESS_FORM_VALUES.MILITARY_STATES.has(stateCode)) {
    addressType = ADDRESS_TYPES.OVERSEAS_MILITARY;
  }

  return addressType;
};

export const convertNextValueToCleanData = value => {
  const {
    id,
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    city,
    countryCodeIso3,
    stateCode,
    zipCode,
    internationalPostalCode,
    province,
    'view:livesOnMilitaryBase': livesOnMilitaryBase,
  } = value;

  const addressType = inferAddressType(countryCodeIso3, stateCode);

  return {
    id,
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    addressType,
    city,
    countryCodeIso3: livesOnMilitaryBase
      ? USA.COUNTRY_ISO3_CODE
      : countryCodeIso3,
    province: addressType === ADDRESS_TYPES.INTERNATIONAL ? province : null,
    stateCode: addressType === ADDRESS_TYPES.INTERNATIONAL ? null : stateCode,
    zipCode: addressType !== ADDRESS_TYPES.INTERNATIONAL ? zipCode : null,
    internationalPostalCode:
      addressType === ADDRESS_TYPES.INTERNATIONAL
        ? internationalPostalCode
        : null,
    'view:livesOnMilitaryBase': livesOnMilitaryBase,
  };
};

export const convertCleanDataToPayload = (data, fieldName) => {
  const cleanData = convertNextValueToCleanData(data);
  return pickBy(
    {
      id: cleanData.id,
      addressLine1: cleanData.addressLine1,
      addressLine2: cleanData.addressLine2,
      addressLine3: cleanData.addressLine3,
      addressType: cleanData.addressType,
      city: cleanData.city,
      countryCodeIso3: cleanData.countryCodeIso3,
      stateCode: cleanData.stateCode,
      internationalPostalCode: cleanData.internationalPostalCode,
      zipCode: cleanData.zipCode,
      province: cleanData.province,
      addressPou:
        fieldName === FIELD_NAMES.MAILING_ADDRESS
          ? ADDRESS_POU.CORRESPONDENCE
          : ADDRESS_POU.RESIDENCE,
    },
    e => !!e,
  );
};

function AddressField({ title, fieldName, deleteDisabled }) {
  return (
    <VAPServiceProfileField
      title={title}
      fieldName={fieldName}
      apiRoute={API_ROUTES.ADDRESSES}
      convertCleanDataToPayload={convertCleanDataToPayload}
      deleteDisabled={deleteDisabled}
      Content={AddressView}
      formSchema={getFormSchema()}
      uiSchema={getUiSchema()}
    />
  );
}

AddressField.propTypes = {
  title: PropTypes.string.isRequired,
  deleteDisabled: PropTypes.bool,
  fieldName: PropTypes.oneOf([
    FIELD_NAMES.MAILING_ADDRESS,
    FIELD_NAMES.RESIDENTIAL_ADDRESS,
  ]).isRequired,
};

export default AddressField;
