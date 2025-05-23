import { merge, pick } from 'lodash';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import {
  sponsorDemographicsDescription,
  sponsorDemographicsSubHeader,
  veteranUI,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    'ui:title': sponsorDemographicsSubHeader,
    'view:sponsorDemographicsDescription': {
      'ui:description': sponsorDemographicsDescription,
      'ui:options': {
        displayEmptyObjectOnReview: true,
      },
    },
    veteran: merge({}, veteranUI, {
      ethnicity: { 'ui:title': 'What’s the sponsor’s ethnicity?' },
      race: { 'ui:title': 'What’s the sponsor’s race?' },
      raceComment: {
        'ui:title': 'Enter the race that best describes the sponsor',
        'ui:errorMessages': {
          pattern: 'Please provide a response',
        },
      },
    }),
  },
  'ui:options': {
    itemName: 'ethnicity and race',
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        'view:sponsorDemographicsDescription': {
          type: 'object',
          properties: {},
        },
        veteran: {
          type: 'object',
          required: ['ethnicity', 'race'],
          properties: merge(
            {},
            pick(veteran.properties, ['ethnicity', 'race']),
            {
              raceComment: {
                type: 'string',
                maxLength: 100,
                pattern: /^(?!\s+$)[\w\s.,'"!?()-]+$/,
              },
            },
          ),
        },
      },
    },
  },
};
