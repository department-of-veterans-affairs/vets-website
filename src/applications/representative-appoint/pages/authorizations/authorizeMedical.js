import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import MedicalAuthorizationPolicy from '../../components/MedicalAuthorizationPolicy';
import { authorizationNote } from '../../content/authorizeMedical';
import { getRepType } from '../../utilities/helpers';
import { MedicalAuthorizationDescription } from '../../components/MedicalAuthorizationDescription';

export const uiSchema = {
  'ui:description': ({ formData }) => (
    <MedicalAuthorizationDescription formData={formData} />
  ),
  'view:authorizationPolicy': {
    'ui:description': <MedicalAuthorizationPolicy />,
  },
  authorizationRadio: radioUI({
    title:
      'Do you authorize this accredited representative to access your medical records?',
    updateUiSchema: formData => {
      const title = `Do you authorize this accredited ${getRepType(
        formData['view:selectedRepresentative'],
      )} to access your medical records?`;
      return { 'ui:title': title };
    },
  }),
  'view:authorizationNote4': {
    'ui:description': authorizationNote,
  },
};

export const schema = {
  type: 'object',
  required: ['authorizationRadio'],
  properties: {
    'view:authorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizationRadio: radioSchema([
      'Yes, they can access all of these types of records',
      'Yes, but they can only access some of these types of records',
      `No, they can't access any of these types of records`,
    ]),
    'view:authorizationNote4': {
      type: 'object',
      properties: {},
    },
  },
};
