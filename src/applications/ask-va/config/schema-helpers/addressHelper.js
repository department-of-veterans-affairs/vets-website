import merge from 'lodash/merge';
import * as address from '@department-of-veterans-affairs/platform-forms-system/address';
import { radioUI, radioSchema } from './radioHelper';
import {
  postOfficeOptions,
  regionOptions,
  addressFields,
} from '../../constants';

import fullSchema from '../0873-schema.json';

const addressUI = address.uiSchema('');
const addressSchema = address.schema(fullSchema, true).properties;

export const addressPageUISchema = {
  country: addressUI.country,
  street: {
    ...merge(addressUI.street, { 'ui:title': addressFields.STREET }),
    'ui:required': () => true,
  },
  street2: merge(addressUI.street2, { 'ui:title': addressFields.STREET_2 }),
  militaryAddress: {
    'ui:options': {
      hideIf: form => !form.onBaseOutsideUS,
    },
    militaryPostOffice: radioUI({
      title: addressFields.POST_OFFICE,
      labels: postOfficeOptions,
    }),
    militaryState: radioUI({
      title: addressFields.MILITARY_STATE,
      labels: regionOptions,
    }),
  },
  city: {
    ...merge(addressUI.city, { 'ui:title': addressFields.CITY }),
    'ui:required': () => true,
    'ui:options': {
      hideIf: form => form.onBaseOutsideUS,
    },
  },
  state: {
    ...merge(addressUI.state, { 'ui:title': addressFields.STATE }),
    'ui:required': () => true,
    'ui:options': {
      hideIf: form => form.onBaseOutsideUS,
    },
  },
  postalCode: {
    ...merge(addressUI.postalCode, { 'ui:title': addressFields.ZIP }),
    'ui:required': () => true,
  },
};

export const addressPageSchema = {
  country: addressSchema.country,
  street: addressSchema.street,
  street2: addressSchema.street2,
  militaryAddress: {
    type: 'object',
    properties: {
      militaryPostOffice: radioSchema(Object.keys(postOfficeOptions)),
      militaryState: radioSchema(Object.keys(regionOptions)),
    },
  },
  city: addressSchema.city,
  state: addressSchema.state,
  postalCode: addressSchema.postalCode,
};
