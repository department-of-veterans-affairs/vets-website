import React from 'react';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const medicalDescription = (
  <div>
    <h4>Medical Care</h4>
    <p>
      Did you spend time in a hospital or under a doctor's care for your
      service-connected disabilties in the past 12 months?
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'view:medicalCare': {
    'ui:title': medicalDescription,
    'ui:widget': 'yesNo',
  },
  'view:medicalCareType': {
    'view:doctorsCare': {
      'ui:title': 'Yes, I‘ve been under a doctor‘s care',
    },
    'view:hospitalized': {
      'ui:title': 'Yes, I‘ve been hospitalized',
    },
    'ui:options': {
      expandUnder: 'view:medicalCare',
      expandUnderCondition: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:medicalCare': {
      type: 'boolean',
    },
    'view:medicalCareType': {
      type: 'object',
      properties: {
        'view:doctorsCare': {
          type: 'boolean',
        },
        'view:hospitalized': {
          type: 'boolean',
        },
      },
    },
  },
};
