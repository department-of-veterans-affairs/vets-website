import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  titleUI,
  addressUI,
  addressSchema,
  dateOfBirthSchema,
  dateOfBirthUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaDateField from 'platform/forms-system/src/js/web-component-fields/VaDateField';
import { vehicleReceiptFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Section IV: Receipt for automobile or conveyance (if applicable)',
      'Complete this section if you have already purchased the vehicle or conveyance.',
    ),
    'ui:description': (
      <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
        <p className="vads-u-margin--0">
          If you have not yet purchased the vehicle, you may leave this section
          blank or provide details later.
        </p>
      </VaAlert>
    ),
    [vehicleReceiptFields.parentObject]: {
      [vehicleReceiptFields.make]: {
        'ui:title': 'Make of vehicle',
        'ui:options': { hideEmptyValueInReview: true },
      },
      [vehicleReceiptFields.model]: {
        'ui:title': 'Model of vehicle',
        'ui:options': { hideEmptyValueInReview: true },
      },
      [vehicleReceiptFields.year]: {
        'ui:title': 'Year',
        'ui:options': { hideEmptyValueInReview: true },
      },
      [vehicleReceiptFields.vin]: {
        'ui:title': 'Vehicle Identification Number (VIN)',
        'ui:options': { hideEmptyValueInReview: true },
      },
      [vehicleReceiptFields.purchasePrice]: {
        'ui:title': 'Total purchase price',
        'ui:options': { hideEmptyValueInReview: true },
      },
      [vehicleReceiptFields.dateOfSale]: {
        ...dateOfBirthUI({ hint: 'Date you purchased the vehicle' }),
        'ui:title': 'Date of sale',
        'ui:webComponentField': VaDateField,
        'ui:options': { hideEmptyValueInReview: true },
      },
      [vehicleReceiptFields.sellerName]: {
        'ui:title': 'Seller name',
        'ui:options': { hideEmptyValueInReview: true },
      },
      [vehicleReceiptFields.sellerAddress]: addressUI({
        labels: { street2: 'Apartment or unit number', postalCode: 'ZIP code' },
        omit: ['street3'],
        required: false,
      }),
      [vehicleReceiptFields.hasDriversLicense]: yesNoUI({
        title: "Do you have a valid driver's license or learner's permit?",
        'ui:options': { hideEmptyValueInReview: true },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [vehicleReceiptFields.parentObject]: {
        type: 'object',
        properties: {
          [vehicleReceiptFields.make]: { type: 'string', maxLength: 50 },
          [vehicleReceiptFields.model]: { type: 'string', maxLength: 50 },
          [vehicleReceiptFields.year]: { type: 'string', maxLength: 4 },
          [vehicleReceiptFields.vin]: { type: 'string', maxLength: 20 },
          [vehicleReceiptFields.purchasePrice]: {
            type: 'string',
            maxLength: 20,
          },
          [vehicleReceiptFields.dateOfSale]: dateOfBirthSchema,
          [vehicleReceiptFields.sellerName]: { type: 'string', maxLength: 100 },
          [vehicleReceiptFields.sellerAddress]: addressSchema({
            omit: ['street3'],
          }),
          [vehicleReceiptFields.hasDriversLicense]: yesNoSchema,
        },
      },
    },
  },
};
