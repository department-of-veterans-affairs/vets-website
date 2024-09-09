import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';

import {
  applicantDemographicsDescription,
  applicantDemographicsSubHeader,
  veteranUI,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    'ui:title': applicantDemographicsSubHeader,
    'view:applicantDemographicsDescription': {
      'ui:description': applicantDemographicsDescription,
      'ui:options': {
        displayEmptyObjectOnReview: true,
      },
    },
    veteran: merge({}, veteranUI, {
      raceComment: {
        'ui:errorMessages': {
          pattern: 'Please provide a response',
        },
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        'view:applicantDemographicsDescription': {
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
                pattern: /^(?!\s+$).*/,
              },
            },
          ),
        },
      },
    },
  },
};
