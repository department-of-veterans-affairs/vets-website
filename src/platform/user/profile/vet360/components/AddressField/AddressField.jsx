import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import ADDRESS_DATA from 'platform/forms/address/data';
import cloneDeep from 'platform/utilities/data/cloneDeep';

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

// make an object of just the military state codes and names
const MILITARY_STATES = Object.entries(ADDRESS_DATA.states).reduce(
  (militaryStates, [stateCode, stateName]) => {
    if (ADDRESS_DATA.militaryStates.includes(stateCode)) {
      return {
        ...militaryStates,
        [stateCode]: stateName,
      };
    }
    return militaryStates;
  },
  {},
);

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
    result = 'Zip code is required';
  } else if (!zipCode.match(/\d{5}/)) {
    result = 'Zip code must be 5 digits';
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

const formSchema = {
  type: 'object',
  properties: {
    'view:livesOnMilitaryBase': {
      type: 'boolean',
    },
    'view:livesOnMilitaryBaseInfo': {
      type: 'object',
      properties: {},
    },
    countryName: {
      type: 'string',
      enum: ADDRESS_FORM_VALUES.COUNTRIES,
    },
    addressLine1: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    addressLine2: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    addressLine3: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    city: {
      type: 'string',
    },
    stateCode: {
      type: 'string',
      enum: Object.keys(ADDRESS_DATA.states),
      enumNames: Object.values(ADDRESS_DATA.states),
    },
    province: {
      type: 'string',
    },
    zipCode: {
      type: 'string',
      pattern: '^\\d{5}$',
    },
    internationalPostalCode: {
      type: 'string',
    },
  },
  required: ['countryName', 'addressLine1', 'city'],
};

const uiSchema = {
  'view:livesOnMilitaryBase': {
    'ui:title':
      'I live on a United States military base outside of the United States',
  },
  'view:livesOnMilitaryBaseInfo': {
    'ui:description': () => (
      <div className="vads-u-padding-x--2p5">
        <AdditionalInfo
          status="info"
          triggerText="Learn more about military base addresses"
        >
          <span>
            The United States is automatically chosen as your country if you
            live on a military base outside of the country.
          </span>
        </AdditionalInfo>
      </div>
    ),
  },
  countryName: {
    'ui:title': 'Country',
    'ui:options': {
      updateSchema: formData => {
        if (formData['view:livesOnMilitaryBase']) {
          return {
            enum: [USA.COUNTRY_NAME],
          };
        }
        return {
          enum: ADDRESS_FORM_VALUES.COUNTRIES,
        };
      },
    },
  },
  addressLine1: {
    'ui:title': 'Street address',
    'ui:errorMessages': {
      required: 'Street address is required',
      pattern: 'Street address must be under 100 characters',
    },
  },
  addressLine2: {
    'ui:title': 'Street address',
  },
  addressLine3: {
    'ui:title': 'Street address',
  },
  city: {
    'ui:errorMessages': {
      required: 'City is required',
      pattern: 'City must be under 100 characters',
    },
    'ui:options': {
      replaceSchema: formData => {
        if (formData['view:livesOnMilitaryBase'] === true) {
          return {
            type: 'string',
            title: 'APO/FPO/DPO',
            enum: ADDRESS_DATA.militaryCities,
          };
        }
        return {
          type: 'string',
          title: 'City',
          minLength: 1,
          maxLength: 100,
          pattern: '^.*\\S.*',
        };
      },
    },
  },
  stateCode: {
    'ui:title': 'State',
    'ui:errorMessages': {
      required: 'State is required',
    },
    'ui:options': {
      hideIf: formData => formData.countryName !== USA.COUNTRY_NAME,
      updateSchema: formData => {
        if (formData['view:livesOnMilitaryBase']) {
          return {
            enum: Object.keys(MILITARY_STATES),
            enumNames: Object.values(MILITARY_STATES),
          };
        }
        return {
          enum: Object.keys(ADDRESS_DATA.states),
          enumNames: Object.values(ADDRESS_DATA.states),
        };
      },
    },
    'ui:required': formData => formData.countryName === USA.COUNTRY_NAME,
  },
  province: {
    'ui:title': 'State/Province/Region',
    'ui:options': {
      hideIf: formData => formData.countryName === USA.COUNTRY_NAME,
    },
  },
  zipCode: {
    'ui:title': 'Zip Code',
    'ui:errorMessages': {
      required: 'Zip code is required',
      pattern: 'Zip code must be 5 digits',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => formData.countryName !== USA.COUNTRY_NAME,
    },
    'ui:required': formData => formData.countryName === USA.COUNTRY_NAME,
  },
  internationalPostalCode: {
    'ui:title': 'International postal code',
    'ui:errorMessages': {
      required: 'Postal code is required',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => formData.countryName === USA.COUNTRY_NAME,
    },
    'ui:required': formData => formData.countryName !== USA.COUNTRY_NAME,
  },
};

/**
 * Helper that returns the correct form schema object based on which address
 * field is being rendered
 */
const getFormSchema = fieldName => {
  if (fieldName === FIELD_NAMES.MAILING_ADDRESS) {
    return cloneDeep(formSchema);
  }
  const schema = cloneDeep(formSchema);
  delete schema.properties['view:livesOnMilitaryBase'];
  delete schema.properties['view:livesOnMilitaryBaseInfo'];
  return schema;
};

/**
 * Helper that returns the correct ui schema object based on which address
 * field is being rendered
 */
const getUiSchema = fieldName => {
  if (fieldName === FIELD_NAMES.MAILING_ADDRESS) {
    return cloneDeep(uiSchema);
  }
  const schema = cloneDeep(uiSchema);
  delete schema['view:livesOnMilitaryBase'];
  delete schema['view:livesOnMilitaryBaseInfo'];
  return schema;
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
