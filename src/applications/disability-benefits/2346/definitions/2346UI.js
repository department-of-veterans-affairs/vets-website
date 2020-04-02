import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
// import _ from 'platform/utilities/data';
import React from 'react';
// import { createSelector } from 'reselect';
import fullSchema from '../2346-schema.json';
// import AddressCardField from '../components/addressFields/AddressCardField';
// import { AddressViewField } from '../components/addressFields/AddressViewField';
import orderSupplyPageContent from '../components/oderSupplyPageContent';
import orderAccessoriesPageContent from '../components/orderAccessoriesPageContent';
import SelectArrayItemsAccessoriesWidget from '../components/SelectArrayItemsAccessoriesWidget';
import SelectArrayItemsBatteriesWidget from '../components/SelectArrayItemsBatteriesWidget';
import {
  // canLabels,
  // canProvinces,
  // mexLabels,
  // mexStates,
  // militaryLabels,
  // militaryStates,
  schemaFields,
  // usaLabels,
  // usaStates,
} from '../constants';
// import {
//   validateMilitaryCity,
//   validateMilitaryState,
//   validateZIP,
// } from '../helpers';

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
 * @param {boolean} useStreet3 - Show a third line in the address
 * @param {function} isRequired - A function for conditionally setting if an address is required.
 *  Receives formData and an index (if in an array item)
 * @param {boolean} ignoreRequired - Ignore the required fields array, to avoid overwriting form specific
 *   customizations
 * @returns {object} - UI schema for an address card's content
 */

// const addressUISchema = (
//   addressPath,
//   title,
//   reviewCard,
//   useStreet3 = false,
//   isRequired = null,
//   ignoreRequired = false,
// ) => {
//   let fieldOrder = [
//     'country',
//     'street',
//     'street2',
//     'street3',
//     'city',
//     'state',
//     'postalCode',
//   ];
//   const requiredFields = ['street', 'city', 'country', 'state', 'postalCode'];

//   if (!useStreet3) {
//     fieldOrder = fieldOrder.filter(field => field !== 'street3');
//   }

//   const addressSchema = fullSchema.definitions.address;

//   function isMilitaryCity(militaryCity = '') {
//     const lowerCity = militaryCity.toLowerCase().trim();

//     return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
//   }

//   const addressChangeSelector = createSelector(
//     ({ formData, updatedPath }) =>
//       _.get(updatedPath.concat('country'), formData),
//     ({ formData, updatedPath }) => _.get(updatedPath.concat('city'), formData),
//     (currentCountry, city) => {
//       const schemaUpdate = {
//         properties: addressSchema.properties,
//         required: addressSchema.required,
//       };
//       const country =
//         currentCountry || addressSchema.properties.country.default;
//       const required = addressSchema.required.length > 0;

//       let stateList;
//       let labelList;
//       if (country === 'USA') {
//         stateList = usaStates;
//         labelList = usaLabels;
//       } else if (country === 'CAN') {
//         stateList = canProvinces;
//         labelList = canLabels;
//       } else if (country === 'MEX') {
//         stateList = mexStates;
//         labelList = mexLabels;
//       }

//       if (stateList) {
//         // We have a list and it’s different, so we need to make schema updates
//         if (addressSchema.properties.state.enum !== stateList) {
//           const withEnum = _.set(
//             'state.enum',
//             stateList,
//             schemaUpdate.properties,
//           );
//           schemaUpdate.properties = _.set(
//             'state.enumNames',
//             labelList,
//             withEnum,
//           );

//           // all the countries with state lists require the state field, so add that if necessary
//           if (
//             !ignoreRequired &&
//             required &&
//             !addressSchema.required.some(field => field === 'state')
//           ) {
//             schemaUpdate.required = addressSchema.required.concat('state');
//           }
//         }
//         // We don’t have a state list for the current country, but there’s an enum in the schema
//         // so we need to update it
//       } else if (addressSchema.properties.state.enum) {
//         const withoutEnum = _.unset('state.enum', schemaUpdate.properties);
//         schemaUpdate.properties = _.unset('state.enumNames', withoutEnum);
//         if (!ignoreRequired && required) {
//           schemaUpdate.required = addressSchema.required.filter(
//             field => field !== 'state',
//           );
//         }
//       }

//       // Canada has a different title than others, so set that when necessary
//       if (
//         country === 'CAN' &&
//         addressSchema.properties.state.title !== 'Province'
//       ) {
//         schemaUpdate.properties = _.set(
//           'state.title',
//           'Province',
//           schemaUpdate.properties,
//         );
//       } else if (
//         country !== 'CAN' &&
//         addressSchema.properties.state.title !== 'State'
//       ) {
//         schemaUpdate.properties = _.set(
//           'state.title',
//           'State',
//           schemaUpdate.properties,
//         );
//       }

//       // We constrain the state list when someone picks a city that’s a military base
//       if (
//         country === 'USA' &&
//         isMilitaryCity(city) &&
//         schemaUpdate.properties.state.enum !== militaryStates
//       ) {
//         const withEnum = _.set(
//           'state.enum',
//           militaryStates,
//           schemaUpdate.properties,
//         );
//         schemaUpdate.properties = _.set(
//           'state.enumNames',
//           militaryLabels,
//           withEnum,
//         );
//       }

//       return schemaUpdate;
//     },
//   );

//   return {
// 'ui:order': fieldOrder,
// 'ui:title': title,
// 'ui:field': AddressCardField,
// 'ui:options': {
//   viewComponent: AddressViewField,
//   updateSchema: (formData, schema, uiSchema, index, path) => {
//     let currentSchema = addressSchema;
//     if (isRequired) {
//       const required = isRequired(formData, index);
//       if (required && currentSchema.required.length === 0) {
//         currentSchema = _.set('required', requiredFields, currentSchema);
//       } else if (!required && currentSchema.required.length > 0) {
//         currentSchema = _.set('required', [], currentSchema);
//       }
//     }
//     let updatedPath = path;
//     if (uiSchema['ui:title'] === 'Permanent address') {
//       updatedPath = ['permanentAddress'];
//     } else if (uiSchema['ui:title'] === 'Temporary address') {
//       updatedPath = ['temporaryAddress'];
//     }
//     return addressChangeSelector({
//       formData,
//       addressSchema: currentSchema,
//       updatedPath,
//     });
//   },
// },
// 'ui:reviewWidget': AddressViewField,
// 'ui:reviewField': ({ children, uiSchema }) => (
//   <div className="review-row">
//     <dt>
//       {uiSchema['ui:title']}
//       {uiSchema['ui:description']}
//       this is a test
//     </dt>
//     <dd>{children}</dd>
//   </div>
// ),

//     country: {
//       'ui:title': 'Country',
//       'ui:required': () => true,
//       'ui:options': {
//         updateSchema(
//           formData,
//           schema,
//           uiSchema,
//           index,
//           pathToCurrentData,
//           isMilitaryBaseChecked,
//           currentAddressField,
//         ) {
//           const updatedUISchema = uiSchema;
//           const updatedFormData = formData;
//           const updatedSchema = schema;

//           if (currentAddressField === 'permanentAddress') {
//             if (isMilitaryBaseChecked) {
//               updatedUISchema.country['ui:disabled'] = true;
//               updatedFormData.country = 'United States';
//               delete updatedSchema.properties.country.enum;
//               delete updatedSchema.properties.country.enumNames;
//               updatedSchema.properties.country.default = 'United States';
//             } else {
//               updatedUISchema.country['ui:disabled'] = false;
//               updatedSchema.properties.country.enum = ['USA', 'CAN', 'MEX'];
//               updatedSchema.properties.country.enumNames = [
//                 'United States',
//                 'Canada',
//                 'Mexico',
//               ];
//             }
//           } else if (currentAddressField === 'temporaryAddress') {
//             if (isMilitaryBaseChecked) {
//               updatedUISchema.country['ui:disabled'] = true;
//               updatedFormData.country = 'United States';
//               delete updatedSchema.properties.country.enum;
//               delete updatedSchema.properties.country.enumNames;
//               updatedSchema.properties.country.default = 'United States';
//             } else {
//               updatedUISchema.country['ui:disabled'] = false;
//               updatedSchema.properties.country.enum = ['USA', 'CAN', 'MEX'];
//               updatedSchema.properties.country.enumNames = [
//                 'United States',
//                 'Canada',
//                 'Mexico',
//               ];
//             }
//           }

//           return {};
//         },
//       },
//       'ui:errorMessages': {
//         pattern: 'Please select a country',
//         required: 'Please select a country',
//       },
//       'ui:disabled': false,
//     },
//     street: {
//       'ui:title': 'Street address',
//       'ui:required': () => true,
//       'ui:errorMessages': {
//         pattern: 'Please enter a valid street address',
//         required: 'Please enter a street address',
//       },
//     },
//     street2: {
//       'ui:title': 'Line 2',
//       'ui:errorMessages': {
//         pattern: 'Please enter a valid street address',
//       },
//     },
//     city: {
//       'ui:title': 'City',
//       'ui:required': () => true,
//       'ui:validations': [
//         {
//           options: { addressPath },
//           // pathWithIndex is called in validateMilitaryCity
//           validator: validateMilitaryCity,
//         },
//       ],
//       'ui:errorMessages': {
//         pattern: 'Please enter a valid city',
//         required: 'Please enter a city',
//       },
//       'ui:options': {
//         updateSchema(
//           formData,
//           schema,
//           uiSchema,
//           index,
//           pathToCurrentData,
//           isMilitaryBaseChecked,
//           currentAddressField,
//         ) {
//           const updatedUISchema = uiSchema;
//           if (currentAddressField === 'permanentAddress') {
//             if (isMilitaryBaseChecked) {
//               updatedUISchema.city['ui:title'] = 'APO / FPO / DPO';
//             } else {
//               updatedUISchema.city['ui:title'] = 'City';
//             }
//           } else if (currentAddressField === 'temporaryAddress') {
//             if (isMilitaryBaseChecked) {
//               updatedUISchema.city['ui:title'] = 'APO / FPO / DPO';
//             } else {
//               updatedUISchema.city['ui:title'] = 'City';
//             }
//           }
//           return {};
//         },
//       },
//     },
//     state: {
//       'ui:title': 'State',
//       'ui:required': () => true,
//       'ui:validations': [
//         {
//           options: { addressPath },
//           // pathWithIndex is called in validateMilitaryState
//           validator: validateMilitaryState,
//         },
//       ],
//       'ui:errorMessages': {
//         pattern: 'Please select a state',
//         required: 'Please select a state',
//       },
//     },
//     postalCode: {
//       'ui:title': 'Postal code',
//       'ui:validations': [validateZIP],
//       'ui:required': () => true,
//       'ui:errorMessages': {
//         required: 'Please enter a postal code',
//         pattern:
//           'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
//       },
//       'ui:options': {
//         widgetClassNames: 'va-input-medium-large',
//       },
//     },
//   };
// };

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedUISchemas: {
    dateOfBirthUI: currentOrPastDateUI('Date of Birth'),
    fullNameUI,
    // permAddressUI: {},
    // tempAddressUI:
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
        hideOnReview: true,
      },
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
        hideOnReview: true,
      },
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
      'ui:title': 'Which hearing aid do you need accessories for?',
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
