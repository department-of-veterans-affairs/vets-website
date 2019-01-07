import React from 'react';

import HospitalizationPeriodView from '../components/HospitalizationPeriodView';

// import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { unemployabilityTitleHospitalization } from '../content/unemployabilityFormIntro';

// const { hospitalizationHistory } = fullSchema.properties;

import tempSchema from '../config/schema'; // Will change to fullSchema when json schema approved

const { hospitalizationHistory } = tempSchema.properties;

const recordsDescription = (
  <div>
    <p>
      If you received care from a private medical facility, we can get that
      information for you. We'll ask you about that later in this process.
    </p>
    <p>
      If you received care at a VA medical facility, we have access to those
      records and can get them for you.
    </p>
  </div>
);

export const uiSchema = {
  unemployability: {
    'ui:title': unemployabilityTitleHospitalization,
    hospitalizationHistory: {
      'ui:title': 'Hospitalization',
      'ui:options': {
        itemName: 'Hospital',
        viewField: HospitalizationPeriodView,
        hideTitle: true,
      },
      items: {
        hospitalName: {
          'ui:title': 'Name of hospital',
        },
        hospitalizationDateRange: {
          'ui:title':
            'When were you in this hospital? Include the dates you were admitted and discharged for each stay.',
        },
        hospitalAddress: {
          addressLine1: {
            'ui:title': 'Street address',
          },
          addressLine2: {
            'ui:title': 'Street address (optional)',
          },
          city: {
            'ui:title': 'City',
          },
          state: {
            'ui:title': 'State',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
          },
          zipCode: {
            'ui:title': 'ZIP',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
            'ui:errorMessages': {
              pattern: 'Please provide valid 5 or 9 digit zip code.',
            },
          },
        },
      },
    },
    'view:recordsInfo': {
      'ui:description': recordsDescription,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        hospitalizationHistory,
        'view:recordsInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
