import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import _ from 'platform/utilities/data';
import React from 'react';
import { createSelector } from 'reselect';
import fullSchema from '../2346-schema.json';
import AddressCardField from '../components/addressFields/AddressCardField';
import { AddressViewField } from '../components/addressFields/AddressViewField';
import orderSupplyPageContent from '../components/oderSupplyPageContent';
import orderAccessoriesPageContent from '../components/orderAccessoriesPageContent';
import SelectArrayItemsAccessoriesWidget from '../components/SelectArrayItemsAccessoriesWidget';
import SelectArrayItemsBatteriesWidget from '../components/SelectArrayItemsBatteriesWidget';
import SuppliesReview from '../components/suppliesReview';
import {
  canLabels,
  canProvinces,
  mexLabels,
  mexStates,
  militaryLabels,
  militaryStates,
  schemaFields,
  usaLabels,
  usaStates,
} from '../constants';
import {
  validateMilitaryCity,
  validateMilitaryState,
  validateZIP,
} from '../helpers';

const { viewAddAccessoriesField, viewAddBatteriesField } = schemaFields;

const emailUITitle = (
  <>
    <h4>Email address</h4>
  </>
);

const emailUIDescription = (
  <>
    <p>
      We will send an order confirmation email with a tracking number to this
      email address.
    </p>
    <p>Email address</p>
  </>
);

/**
 * @param {string} addressPath - The path to the address in the formData
 * @param {string} [title] - Displayed as the card title in the card's header
 * @param {boolean} reviewCard - Whether to display the information in a AddressCardField or not
 * @param {boolean} fieldsAreRequired - Whether the typical fields should be required or not
 * @returns {object} - UI schema for an address card's content
 */

const addressUISchema = (
  addressPath,
  title,
  reviewCard,
  useStreet3 = false,
  isRequired = null,
  ignoreRequired = false,
) => {
  let fieldOrder = [
    'country',
    'street',
    'street2',
    'street3',
    'city',
    'state',
    'postalCode',
  ];
  const requiredFields = ['street', 'city', 'country', 'state', 'postalCode'];

  if (!useStreet3) {
    fieldOrder = fieldOrder.filter(field => field !== 'street3');
  }
  const addressDefinition = fullSchema.definitions.address;

  const addressChangeSelector = createSelector(
    ({ formData, updatedPath }) =>
      _.get(updatedPath.concat('country'), formData),
    ({ formData, updatedPath }) => _.get(updatedPath.concat('city'), formData),
    (currentCountry, city) => {
      const schemaUpdate = {
        definition: addressDefinition,
        required: addressDefinition.required,
      };
      const country =
        currentCountry || addressDefinition.properties.country.default;
      const required = addressDefinition.required.length > 0;

      let stateList;
      let labelList;
      if (country === 'USA') {
        stateList = usaStates;
        labelList = usaLabels;
      } else if (country === 'CAN') {
        stateList = canProvinces;
        labelList = canLabels;
      } else if (country === 'MEX') {
        stateList = mexStates;
        labelList = mexLabels;
      }

      if (stateList) {
        // We have a list and it’s different, so we need to make schema updates
        if (addressDefinition.properties.state.enum !== stateList) {
          const withEnum = _.set(
            'state.enum',
            stateList,
            schemaUpdate.definition.properties,
          );
          schemaUpdate.definition.properties = _.set(
            'state.enumNames',
            labelList,
            withEnum,
          );

          // all the countries with state lists require the state field, so add that if necessary
          if (
            !ignoreRequired &&
            required &&
            !addressDefinition.required.some(field => field === 'state')
          ) {
            schemaUpdate.required = addressDefinition.required.concat('state');
          }
        }
        // We don’t have a state list for the current country, but there’s an enum in the schema
        // so we need to update it
      } else if (addressDefinition.properties.state.enum) {
        const withoutEnum = _.unset(
          'state.enum',
          schemaUpdate.definition.properties,
        );
        schemaUpdate.definition.properties = _.unset(
          'state.enumNames',
          withoutEnum,
        );
        if (!ignoreRequired && required) {
          schemaUpdate.required = addressDefinition.properties.required.filter(
            field => field !== 'state',
          );
        }
      }

      // Canada has a different title than others, so set that when necessary
      if (
        country === 'CAN' &&
        addressDefinition.properties.state.title !== 'Province'
      ) {
        schemaUpdate.definition.properties = _.set(
          'state.title',
          'Province',
          schemaUpdate.definition.properties,
        );
      } else if (
        country !== 'CAN' &&
        addressDefinition.properties.state.title !== 'State'
      ) {
        schemaUpdate.definition.properties = _.set(
          'state.title',
          'State',
          schemaUpdate.definition.properties,
        );
      }
      function isMilitaryCity(militaryCity = '') {
        const lowerCity = militaryCity.toLowerCase().trim();

        return (
          lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo'
        );
      }

      // We constrain the state list when someone picks a city that’s a military base
      if (
        country === 'USA' &&
        isMilitaryCity(city) &&
        addressDefinition.properties.state.enum !== militaryStates
      ) {
        const withEnum = _.set(
          'state.enum',
          militaryStates,
          schemaUpdate.definition.properties,
        );
        schemaUpdate.definition.properties = _.set(
          'state.enumNames',
          militaryLabels,
          withEnum,
        );
      }

      return schemaUpdate;
    },
  );

  return {
    'ui:order': fieldOrder,
    'ui:title': title,
    'ui:field': AddressCardField,
    'ui:options': {
      viewComponent: AddressViewField,
      updateSchema: (formData, schema, uiSchema, index, path) => {
        let updatedSchema = schema;
        if (isRequired) {
          const required = isRequired(formData, index);
          if (required && updatedSchema.required.length === 0) {
            updatedSchema = _.set('required', requiredFields, updatedSchema);
          } else if (!required && updatedSchema.required.length > 0) {
            updatedSchema = _.set('required', [], updatedSchema);
          }
        }
        let updatedPath = path;
        if (uiSchema['ui:title'] === 'Permanent address') {
          updatedPath = ['permanentAddress'];
        } else if (uiSchema['ui:title'] === 'Temporary address') {
          updatedPath = ['temporaryAddress'];
        }
        return addressChangeSelector({
          formData,
          updatedSchema,
          updatedPath,
        });
      },
    },
    'ui:reviewWidget': AddressViewField,
    'ui:reviewField': ({ children, uiSchema }) => (
      <div className="review-row">
        <dt>
          {uiSchema['ui:title']}
          {uiSchema['ui:description']}
          this is a test
        </dt>
        <dd>{children}</dd>
      </div>
    ),

    country: {
      'ui:title': 'Country',
      'ui:required': () => true,
      'ui:options': {
        // TODO: Set up UI changes when military base is checked -@maharielrosario at 3/24/2020, 6:45:14 PM
        updateSchema(
          formData,
          schema,
          uiSchema,
          index,
          pathToCurrentData,
          isMilitaryBaseChecked,
          currentAddressField,
        ) {
          const updatedUISchema = uiSchema;
          const originalFormData = formData;
          const updatedFormData = originalFormData;
          const originalCountryEnum =
            schema.enum || schema.properties.country.enum;
          let updatedCountryEnum;

          if (currentAddressField === 'permanentAddress') {
            if (isMilitaryBaseChecked) {
              updatedUISchema.country['ui:disabled'] = true;
              updatedFormData.country = 'USA';
              updatedCountryEnum = ['USA'];
            } else {
              const originalCountry = originalFormData.country;
              updatedUISchema.country['ui:disabled'] = false;
              updatedFormData.country = originalCountry;
              updatedCountryEnum = originalCountryEnum;
            }
          } else if (currentAddressField === 'temporaryAddress') {
            if (isMilitaryBaseChecked) {
              updatedUISchema.country['ui:disabled'] = true;
              updatedFormData.country = 'USA';
              updatedCountryEnum = ['USA'];
            } else {
              const originalCountry = originalFormData.country;
              updatedUISchema.country['ui:disabled'] = false;
              updatedFormData.country = originalCountry;
              updatedCountryEnum = originalCountryEnum;
            }
          }

          return {
            enum: updatedCountryEnum || originalCountryEnum,
            default: 'USA',
            updatedUISchema,
            isMilitaryBaseChecked,
          };
        },
      },
      'ui:errorMessages': {
        pattern: 'Please select a country',
        required: 'Please select a country',
      },
    },
    street: {
      'ui:title': 'Street address',
      'ui:required': () => true,
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
        required: 'Please enter a street address',
      },
    },
    street2: {
      'ui:title': 'Line 2',
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
      },
    },
    city: {
      'ui:title': 'City',
      'ui:required': () => true,
      'ui:validations': [
        {
          options: { addressPath },
          // pathWithIndex is called in validateMilitaryCity
          validator: validateMilitaryCity,
        },
      ],
      'ui:errorMessages': {
        pattern: 'Please enter a valid city',
        required: 'Please enter a city',
      },
      'ui:options': {
        // TODO: Set up UI changes when military base is checked -@maharielrosario at 3/24/2020, 6:45:14 PM
        //
        updateSchema(
          formData,
          schema,
          uiSchema,
          index,
          pathToCurrentData,
          isMilitaryBaseChecked,
          currentAddressField,
        ) {
          const originalUISchema = uiSchema;
          const originalFormData = formData;
          const updatedFormData = originalFormData;
          const updatedUISchema = originalUISchema;
          if (currentAddressField === 'Permanent address') {
            if (isMilitaryBaseChecked) {
              updatedUISchema.city['ui:title'] = 'APO / FPO / DPO';
            } else {
              updatedUISchema.city['ui:title'] = 'City';
            }
          } else if (currentAddressField === 'Temporary address') {
            if (isMilitaryBaseChecked) {
              updatedUISchema.city['ui:title'] = 'APO / FPO / DPO';
            } else {
              updatedUISchema.city['ui:title'] = 'City';
            }
          }
          return {
            updatedFormData,
            schema,
            updatedUISchema,
            index,
            pathToCurrentData,
            isMilitaryBaseChecked,
            currentAddressField,
          };
        },
      },
    },
    state: {
      'ui:title': 'State',
      'ui:required': () => true,
      'ui:options': {
        // hideIf: (formData, index) =>
        //   _.get(
        //     `${pathWithIndex(addressPath, index)}.country`,
        //     formData,
        //     '',
        //   ) !== USA,
      },
      'ui:validations': [
        {
          options: { addressPath },
          // pathWithIndex is called in validateMilitaryState
          validator: validateMilitaryState,
        },
      ],
      'ui:errorMessages': {
        pattern: 'Please select a state',
        required: 'Please select a state',
      },
    },
    postalCode: {
      'ui:title': 'Postal code',
      'ui:validations': [validateZIP],
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        // hideIf: (formData, index) =>
        //   _.get(
        //     `${pathWithIndex(addressPath, index)}.country`,
        //     formData,
        //     '',
        //   ) !== USA,
      },
    },
  };
};

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedUISchemas: {
    dateOfBirthUI: currentOrPastDateUI('Date of Birth'),
    fullNameUI,
    permAddressUI: addressUISchema(
      'permanentAddress',
      'Permanent address',
      true,
    ),
    tempAddressUI: addressUISchema(
      'temporaryAddress',
      'Temporary address',
      true,
    ),
    emailUI: {
      'ui:title': emailUITitle,
      'ui:description': emailUIDescription,
      'ui:widget': 'email',
      'ui:errorMessages': {
        pattern: 'Please enter an email address using this format: X@X.com',
        required: 'Please enter an email address',
      },
      'ui:options': {
        widgetClassNames: 'va-input-large',
        inputType: 'email',
      },
    },
    genderUI: {
      'ui:title': 'Gender',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          F: 'Female',
          M: 'Male',
        },
      },
    },
    addBatteriesUI: {
      'ui:title': 'Add batteries to your order',
      'ui:description': orderSupplyPageContent,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes, I need to order hearing aid batteries.',
          no: "No, I don't need to order hearing aid batteries.",
        },
      },
      'ui:reviewField': SuppliesReview,
    },
    addAccessoriesUI: {
      'ui:title': 'Add hearing aid accessories to your order',
      'ui:description': orderAccessoriesPageContent,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes, I need to order hearing aid accessories.',
          no: "No, I don't need to order hearing aid accessories.",
        },
      },
      'ui:reviewField': SuppliesReview,
    },
    batteriesUI: {
      'ui:title': 'Which hearing aid do you need batteries for?',
      'ui:description':
        'You will be sent a 6 month supply of batteries for each device you select below.',
      'ui:field': SelectArrayItemsBatteriesWidget,
      'ui:options': {
        expandUnder: viewAddBatteriesField,
        expandUnderCondition: 'yes',
      },
    },
    accessoriesUI: {
      'ui:title': 'Which hearing aid do you need batteries for?',
      'ui:description':
        'You will be sent a 6 month supply of batteries for each device you select below.',
      'ui:field': SelectArrayItemsAccessoriesWidget,
      'ui:options': {
        expandUnder: viewAddAccessoriesField,
        expandUnderCondition: 'yes',
      },
    },
  },
};
