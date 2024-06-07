import React from 'react';
import { authorizationNote } from '../content/authorizeMedical';
import { saveYourApplication } from '../content/saveYourApplication';

export const uiSchema = {
  'view:saveYourApplication': {
    'ui:description': saveYourApplication,
  },
  'view:authorizeMedical': {
    'ui:description': formData => {
      return (
        <>
          <h3>Authorization to access certain medical records</h3>
          <p>
            This accredited{' '}
            {formData.repType || `Veterans Service Organization (VSO)`} may need
            to access certain medical records to help you. You can authorize
            them to access all or some of these types of records:
          </p>
          <ul>
            <li>Alcoholism and alcohol abuse records</li>
            <li>Drug abuse records</li>
            <li>HIV (human immunodeficiency virus) records</li>
            <li>Sickle cell anemia records</li>
          </ul>
        </>
      );
    },
  },
  authorizationRadio: {
    'ui:title': `Do you authorize this accredited VSO to access your medical records?`,
    'ui:widget': 'radio',
    'ui:options': {
      widgetProps: {
        'All records': { 'data-info': 'all_records' },
        'Some records': { 'data-info': 'some_records' },
        'No records': { 'data-info': 'no_records' },
      },
      selectedProps: {
        'All records': { 'aria-describedby': 'all_records' },
        'Some records': { 'aria-describedby': 'some_records' },
        'No records': { 'aria-describedby': 'no_records' },
      },
    },
  },

  'view:authorizationNote': {
    'ui:description': authorizationNote,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:saveYourApplication': {
      type: 'object',
      properties: {},
    },
    'view:authorizeMedical': {
      type: 'object',
      properties: {},
    },
    authorizationRadio: {
      type: 'string',
      enum: [
        'Yes, they can access all of these types of records',
        'Yes, but they can only access some of these types of records',
        `No, they can't access any of these types of records`,
      ],
    },
    'view:authorizationNote': {
      type: 'object',
      properties: {},
    },
  },
};
