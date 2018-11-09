import React from 'react';

import { medicalTreatmentRequiredCheck } from '../validations';

const medicalCareDescription = (
  <div>
    <h5>Medical care</h5>
    <p>
      During the last 12 months, have you been under a doctor‘s care or
      hospitalized for these disabilities?
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': medicalCareDescription,
  careQuestion: {
    'ui:title': ' ',
    'ui:widget': 'yesNo',
    'ui:options': {
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    },
  },
  'view:careReceived': {
    'ui:title': ' ',
    'ui:options': {
      expandUnder: 'careQuestion',
      expandUnderCondition: true,
      showFieldLabel: true,
    },
    'ui:validations': [medicalTreatmentRequiredCheck],
    medicalTreatment: {
      'view:doctorCare': {
        'ui:title': 'Yes, I‘ve been under doctor‘s care',
      },
      'view:hospitalization': {
        'ui:title': 'Yes, I‘ve been hospitalized',
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['careQuestion'],
  properties: {
    careQuestion: {
      type: 'boolean',
    },
    'view:careReceived': {
      type: 'object',
      properties: {
        medicalTreatment: {
          type: 'object',
          properties: {
            'view:doctorCare': {
              type: 'boolean',
            },
            'view:hospitalization': {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
