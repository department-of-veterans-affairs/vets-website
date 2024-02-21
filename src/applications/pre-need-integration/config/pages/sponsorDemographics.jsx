// Is this import needed?
// import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge } from 'lodash';
import {
  sponsorDemographicsDescription,
  sponsorDemographicsSubHeader,
  veteranUI,
} from '../../utils/helpers';

// This will be used again once the changes are made in the json-schema
// const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:title': sponsorDemographicsSubHeader,
  'ui:description': sponsorDemographicsDescription,
  application: {
    veteran: merge({}, veteranUI, {
      maritalStatus: {
        'ui:title': 'What’s the sponsor’s marital status?',
      },
      gender: {
        'ui:title': 'What’s the sponsor’s sex?',
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
        veteran: {
          type: 'object',
          required: ['maritalStatus', 'gender'],
          properties: {
            maritalStatus: {
              type: 'string',
              enum: [
                'Single',
                'Separated',
                'Married',
                'Divorced',
                'Widowed',
                'na',
              ],
            },
            gender: {
              type: 'string',
              enum: ['Female', 'Male', 'na'],
            },
          },
        },
      },
    },
  },
};
