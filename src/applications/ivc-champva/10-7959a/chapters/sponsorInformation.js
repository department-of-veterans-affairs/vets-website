import { cloneDeep } from 'lodash';
import {
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
  addressUI,
  addressSchema,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  validAddressCharsOnly,
  validObjectCharsOnly,
} from '../../shared/validations';
import VeteranNameDescription from '../components/FormDescriptions/VeteranNameDescription';

export const blankSchema = { type: 'object', properties: {} };

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const sponsorNameSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => {
      const isSponsor = formData?.certifierRole === 'sponsor';
      return `${isSponsor ? 'Your' : 'Veteran’s'} name`;
    }, VeteranNameDescription),
    sponsorName: fullNameMiddleInitialUI,
    'ui:validations': [
      (errors, formData) =>
        validObjectCharsOnly(errors, null, formData, 'sponsorName'),
    ],
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      sponsorName: fullNameSchema,
    },
  },
};

export const sponsorAddressSchema = {
  uiSchema: {
    ...titleUI(
      'Your mailing address',
      'We’ll send any important information about this claim to this address.',
    ),
    sponsorAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Address is on military base outside of the United States.',
      },
    }),
    'ui:validations': [
      (errors, formData) =>
        validAddressCharsOnly(errors, null, formData, 'sponsorAddress'),
    ],
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      sponsorAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};

export const sponsorContactSchema = {
  uiSchema: {
    ...titleUI(
      'Your phone number',
      'We may contact you if we have more questions about this claim.',
    ),
    sponsorPhone: phoneUI(),
    sponsorEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['sponsorPhone', 'sponsorEmail'],
    properties: {
      titleSchema,
      sponsorPhone: phoneSchema,
      sponsorEmail: emailSchema,
    },
  },
};
