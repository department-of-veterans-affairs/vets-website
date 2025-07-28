/**
 * Edit Mailing Address Page
 *
 * This page provides a comprehensive mailing address form that includes:
 * - A checkbox for military base addresses with additional information
 * - Standard address fields (country, street address, city, state, postal code)
 * - A radio button option to update the user's VA.gov profile
 *
 * Based on the Figma design for the "Edit mailing address" component.
 */

import {
  addressSchema,
  addressUI,
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// Constants for the update profile radio buttons
const UPDATE_PROFILE_OPTIONS = Object.freeze({
  YES: 'yes',
  NO: 'no',
});

const UPDATE_PROFILE_LABELS = Object.freeze({
  [UPDATE_PROFILE_OPTIONS.YES]: 'Yes, also update my profile',
  [UPDATE_PROFILE_OPTIONS.NO]: 'No, only update this form',
});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Edit mailing address',
      "We'll send any important information about your application to this address.",
    ),
    mailingAddress: addressUI({
      labels: {
        street2: 'Apartment or unit number',
      },
      omit: ['street3'],
      required: {
        street2: false,
      },
    }),
    updateProfile: radioUI({
      title:
        'Do you also want to update your mailing address in your VA.gov profile?',
      hint:
        'If you select "yes," this information will be updated across multiple VA benefits and services.',
      labels: UPDATE_PROFILE_LABELS,
      errorMessages: {
        required: 'Please select an option',
      },
      labelHeaderLevel: '3',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      mailingAddress: addressSchema({
        omit: ['street3'],
      }),
      updateProfile: radioSchema(Object.values(UPDATE_PROFILE_OPTIONS)),
    },
    required: ['mailingAddress', 'updateProfile'],
  },
};
