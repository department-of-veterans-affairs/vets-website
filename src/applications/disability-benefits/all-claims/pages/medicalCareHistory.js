import React from 'react';

const medicalCareDescription = (
  <div>
    <h5>Medical care</h5>
    <p>
      During the last 12 months, have you been under a doctor's care or
      hospitalized for these disabilities?
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': medicalCareDescription,
  careQuestion: {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    },
  },
  'view:careReceived': {
    'ui:options': {
      expandUnder: 'careQuestion',
      expandUnderCondition: 'yes',
    },
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
  properties: {
    careQuestion: {
      type: 'string',
      enum: ['yes', 'no'],
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
