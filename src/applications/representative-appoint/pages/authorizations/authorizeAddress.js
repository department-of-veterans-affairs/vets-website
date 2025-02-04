import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import AddressAuthorizationPolicy from '../../components/AddressAuthorizationPolicy';
import { AddressAuthorizationDescription } from '../../components/AddressAuthorizationDescription';
import { authorizationNote } from '../../content/authorizeMedical';
import { getRepType } from '../../utilities/helpers';

export const uiSchema = {
  'ui:description': ({ formData }) => (
    <AddressAuthorizationDescription formData={formData} />
  ),
  'view:addressAuthorizationPolicy': {
    'ui:description': <AddressAuthorizationPolicy />,
  },
  authorizeAddressRadio: radioUI({
    title:
      'Do you authorize this accredited representative to change your address on VA records?',
    updateUiSchema: formData => {
      const title = `Do you authorize this accredited ${getRepType(
        formData['view:selectedRepresentative'],
      )} to change your address on VA records?`;
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
