import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';

import {
  applicantDemographicsDescription,
  applicantDemographicsSubHeader,
  veteranUI,
  // applicantDemographicsEthnicityTitle,
  // applicantDemographicsRaceTitle,
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
    veteran: veteranUI,
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
          required: ['ethnicity', 'race', 'raceComment'],
          properties: merge(
            {},
            pick(veteran.properties, ['ethnicity', 'race']),
            {
              raceComment: {
                type: 'string',
                maxLength: 100,
              },
            },
          ),
        },
      },
    },
  },
};
