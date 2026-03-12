import {
  addressSchema,
  addressUI,
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  validAddressCharsOnly,
  validObjectCharsOnly,
} from '../../shared/validations';
import VeteranNameDescription from '../components/FormDescriptions/VeteranNameDescription';
import {
  fullNameMiddleInitialSchema,
  fullNameMiddleInitialUI,
} from '../definitions';
import content from '../locales/en/content.json';
import { titleWithRoleUI } from '../utils/titles';

export const sponsorNameSchema = {
  uiSchema: {
    ...titleWithRoleUI(content['page-title--name'], VeteranNameDescription, {
      matchRole: 'sponsor',
      other: content['noun--veteran'],
    }),
    sponsorName: fullNameMiddleInitialUI,
    'ui:validations': [
      (errors, formData) =>
        validObjectCharsOnly(errors, null, formData, 'sponsorName'),
    ],
  },
  schema: {
    type: 'object',
    properties: {
      sponsorName: fullNameMiddleInitialSchema,
    },
  },
};

export const sponsorAddressSchema = {
  uiSchema: {
    ...titleUI(
      content['veteran--mailing-address-title'],
      content['veteran--mailing-address-desc'],
    ),
    sponsorAddress: addressUI({
      labels: {
        militaryCheckbox: content['form-label--address-military'],
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
      sponsorAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};

export const sponsorContactSchema = {
  uiSchema: {
    ...titleUI(
      content['veteran--contact-info-title'],
      content['veteran--contact-info-desc'],
    ),
    sponsorPhone: phoneUI(),
    sponsorEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['sponsorPhone', 'sponsorEmail'],
    properties: {
      sponsorPhone: phoneSchema,
      sponsorEmail: emailSchema,
    },
  },
};
