import { cloneDeep } from 'lodash';
import {
  fullNameUI,
  fullNameSchema,
  titleUI,
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
import { personalizeTitleByRole } from '../utils/helpers';
import content from '../locales/en/content.json';

export const blankSchema = { type: 'object', properties: {} };

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const sponsorNameSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        personalizeTitleByRole(formData, content['page-title--name'], {
          matchRole: 'sponsor',
          other: content['noun--veteran-possessive'],
        }),
      VeteranNameDescription,
    ),
    sponsorName: fullNameMiddleInitialUI,
    'ui:validations': [
      (errors, formData) =>
        validObjectCharsOnly(errors, null, formData, 'sponsorName'),
    ],
  },
  schema: {
    type: 'object',
    properties: {
      sponsorName: fullNameSchema,
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
