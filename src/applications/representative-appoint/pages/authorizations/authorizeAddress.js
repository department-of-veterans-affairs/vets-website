import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import AddressAuthorizationPolicy from '../../components/AddressAuthorizationPolicy';
import { authorizationNote } from '../../content/authorizeMedical';

export const uiSchema = {
  'view:addressAuthorizationPolicy': {
    'ui:description': <AddressAuthorizationPolicy />,
  },
  authorizeAddressRadio: radioUI({
    title:
      'Do you authorize this accredited representative to change your address on VA records?',
    updateUiSchema: () => {
      const title = `Do you authorize this accredited representative to change your address on VA records?`;
      return { 'ui:title': title };
    },
  }),

  'view:authorizationNote3': {
    'ui:description': authorizationNote,
  },
};

export const schema = {
  type: 'object',
  required: ['authorizeAddressRadio'],
  properties: {
    'view:addressAuthorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizeAddressRadio: radioSchema([
      `Yes, they can change my address if it’s incorrect or outdated`,
      `No, they can’t change my address`,
    ]),
    'view:authorizationNote3': {
      type: 'object',
      properties: {},
    },
  },
};
