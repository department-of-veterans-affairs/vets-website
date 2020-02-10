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
} from 'vet360/constants';

import Vet360ProfileField from 'vet360/containers/Vet360ProfileField';

import AddressEditModal from './AddressEditModal';
import AddressView from './AddressView';

import { getFormSchema, getUiSchema } from './address-schemas';

export const inferAddressType = (countryName, stateCode) => {
  let addressType = ADDRESS_TYPES.DOMESTIC;
  if (countryName !== USA.COUNTRY_NAME) {
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
    countryName,
    stateCode,
    zipCode,
    internationalPostalCode,
    province,
    'view:livesOnMilitaryBase': livesOnMilitaryBase,
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
    countryName: livesOnMilitaryBase ? USA.COUNTRY_NAME : countryName,
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

const validateZipCode = zipCode => {
  let result = '';
  if (!zipCode) {
    result = 'Postal code is required';
  } else if (!zipCode.match(/\d{5}/)) {
    result = 'Postal code must be 5 digits';
  }
  return result;
};

export const validateCleanData = (
  {
    addressLine1,
    city,
    stateCode,
    internationalPostalCode,
    zipCode,
    countryName,
  },
  property,
) => {
  const isInternational =
    inferAddressType(countryName, stateCode) === ADDRESS_TYPES.INTERNATIONAL;
  const validateAll = !property;

  return {
    addressLine1:
      (property === 'addressLine1' || validateAll) && !addressLine1
        ? 'Street address is required'
        : '',
    city:
      (property === 'city' || validateAll) && !city ? 'City is required' : '',
    stateCode:
      (property === 'stateCode' || validateAll) &&
      !isInternational &&
      !stateCode
        ? 'State is required'
        : '',
    zipCode:
      (property === 'zipCode' || validateAll) &&
      !isInternational &&
      validateZipCode(zipCode),
    internationalPostalCode:
      (property === 'internationalPostalCode' || validateAll) &&
      isInternational &&
      !internationalPostalCode
        ? 'Postal code is required'
        : '',
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
      countryName: cleanData.countryName,
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

export default class AddressField extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    deleteDisabled: PropTypes.bool,
    fieldName: PropTypes.oneOf([
      FIELD_NAMES.MAILING_ADDRESS,
      FIELD_NAMES.RESIDENTIAL_ADDRESS,
    ]).isRequired,
  };

  render() {
    return (
      <Vet360ProfileField
        title={this.props.title}
        fieldName={this.props.fieldName}
        apiRoute={API_ROUTES.ADDRESSES}
        convertNextValueToCleanData={convertNextValueToCleanData}
        validateCleanData={validateCleanData}
        convertCleanDataToPayload={convertCleanDataToPayload}
        deleteDisabled={this.props.deleteDisabled}
        Content={AddressView}
        EditModal={AddressEditModal}
        formSchema={getFormSchema(this.props.fieldName)}
        uiSchema={getUiSchema(this.props.fieldName)}
      />
    );
  }
}
