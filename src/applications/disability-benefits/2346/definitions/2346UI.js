import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import _ from 'platform/utilities/data';
import React from 'react';
import fullSchema from '../2346-schema.json';
import deviceNameField from '../components/accessoriesCustomFields/deviceNameField';
import lastOrderDateField from '../components/accessoriesCustomFields/lastOrderDateField';
import productIdField from '../components/accessoriesCustomFields/productIdField';
import productNameField from '../components/accessoriesCustomFields/productNameField';
import quantityField from '../components/accessoriesCustomFields/quantityField';
import sizeField from '../components/accessoriesCustomFields/sizeField';
import addressCardField from '../components/addressFields/addressCardField';
import { AddressViewField } from '../components/addressFields/addressViewField.jsx';
import emptyField from '../components/emptyField';
import orderSupplyPageContent from '../components/oderSupplyPageContent';
import SuppliesReview from '../components/suppliesReview';
import {
  MILITARY_CITIES,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  STATE_LABELS,
  STATE_VALUES,
  USA,
} from '../constants';
import {
  pathWithIndex,
  validateMilitaryCity,
  validateMilitaryState,
  validateZIP,
} from '../helpers';

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
 * @param {boolean} reviewCard - Whether to display the information in a addressCardField or not
 * @param {boolean} fieldsAreRequired - Whether the typical fields should be required or not
 * @returns {object} - UI schema for an address card's content
 */
const addressUISchema = (
  addressPath,
  title,
  reviewCard,
  fieldsAreRequired = true,
) => {
  const updateStates = (formData, currentSchema, uiSchema, index) => {
    // Could use path (updateSchema callback param after index), but it points to `state`,
    //  so using `addressPath` is easier
    const currentCity = _.get(
      `${pathWithIndex(addressPath, index)}.city`,
      formData,
      '',
    )
      .trim()
      .toUpperCase();
    if (MILITARY_CITIES.includes(currentCity)) {
      return {
        enum: MILITARY_STATE_VALUES,
        enumNames: MILITARY_STATE_LABELS,
      };
    }

    return {
      enum: STATE_VALUES,
      enumNames: STATE_LABELS,
    };
  };

  return {
    'ui:order': ['country', 'street', 'street2', 'city', 'state', 'postalCode'],
    'ui:title': title,
    'ui:field': addressCardField,
    'ui:options': {
      viewComponent: AddressViewField,
    },
    'ui:reviewField': AddressViewField,
    country: {
      'ui:title': 'Country',
      'ui:required': () => true,
      'ui:options': {
        // TODO: Set up UI changes when military base is checked -@maharielrosario at 3/24/2020, 6:45:14 PM
        // updateSchema(formData, schema, uiSchema, index, pathToCurrentData) {
        //   let newUISchema;
        //   if (
        //     formData.permanentAddress.country ||
        //     formData.temporaryAddress.country
        //   ) {
        //     newUISchema = uiSchema;
        //     newUISchema['ui:enumDisabled'] = ['CAN', 'MEX'];
        //     newUISchema['ui:readonly'] = true;
        //   }
        //   if (newUISchema) {
        //     return {
        //       formData,
        //       schema,
        //       newUISchema,
        //     };
        //   }
        //   return {
        //     formData,
        //     schema,
        //     newUISchema,
        //     c,
        //   };
        // },
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
      'ui:title': 'Street address 2',
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
        // updateSchema(formData, schema, uiSchema, index, pathToCurrentData) {
        //   let newUISchema;
        //   if (
        //     formData.permanentAddress.country ||
        //     formData.temporaryAddress.country
        //   ) {
        //     newUISchema = uiSchema;
        //     newUISchema['ui:title'] = 'APO / FPO / DPO';
        //   }
        //   if (newUISchema) {
        //     return {
        //       formData,
        //       schema,
        //       newUISchema,
        //     };
        //   }
        //   return {
        //     formData,
        //     schema,
        //     uiSchema,
        //   };
        // },
      },
    },
    state: {
      'ui:title': 'State',
      'ui:required': (formData, index) =>
        fieldsAreRequired &&
        _.get(`${pathWithIndex(addressPath, index)}.country`, formData, '') ===
          USA,
      'ui:options': {
        hideIf: (formData, index) =>
          _.get(
            `${pathWithIndex(addressPath, index)}.country`,
            formData,
            '',
          ) !== USA,
        updateSchema: updateStates,
      },
      'ui:validations': [
        {
          options: { addressPath },
          // pathWithIndex is called in validateMilitaryState
          validator: validateMilitaryState,
        },
      ],
      'ui:errorMessages': {
        pattern: 'Please enter a valid state',
        required: 'Please enter a state',
      },
    },
    postalCode: {
      'ui:title': 'Postal code',
      'ui:validations': [validateZIP],
      'ui:required': (formData, index) =>
        fieldsAreRequired &&
        _.get(`${pathWithIndex(addressPath, index)}.country`, formData, '') ===
          USA,
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: (formData, index) =>
          _.get(
            `${pathWithIndex(addressPath, index)}.country`,
            formData,
            '',
          ) !== USA,
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
      'ui:title': 'Add accessories to your order',
      'ui:description': orderSupplyPageContent,
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
      'ui:options': {
        expandUnder: 'yesOrNo',
        expandUnderCondition: 'yes',
      },
      deviceName: {
        'ui:title': '  ',
        'ui:field': deviceNameField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productName: {
        'ui:title': '  ',
        'ui:field': productNameField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      quantity: {
        'ui:title': '  ',
        'ui:field': quantityField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productId: {
        'ui:title': '  ',
        'ui:field': productIdField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      lastOrderDate: {
        'ui:title': '  ',
        'ui:field': lastOrderDateField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      size: {
        'ui:title': '  ',
        'ui:field': sizeField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productGroup: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      availableForReorder: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      nextAvailabilityDate: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
    },
    accessoriesUI: {
      'ui:title': 'Which hearing aid do you need batteries for?',
      'ui:description':
        'You will be sent a 6 month supply of batteries for each device you select below.',
      'ui:options': {
        expandUnder: 'yesOrNo',
        expandUnderCondition: 'yes',
      },
      deviceName: {
        'ui:title': '  ',
        'ui:field': deviceNameField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productName: {
        'ui:title': '  ',
        'ui:field': productNameField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      quantity: {
        'ui:title': '  ',
        'ui:field': quantityField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productId: {
        'ui:title': '  ',
        'ui:field': productIdField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      lastOrderDate: {
        'ui:title': '  ',
        'ui:field': lastOrderDateField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productGroup: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      availableForReorder: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      nextAvailabilityDate: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      size: {
        'ui:title': '  ',
        'ui:field': sizeField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
    },
  },
};
