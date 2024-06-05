import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';
import {
  sponsorDemographicsDescription,
  sponsorDemographicsSubHeader,
  veteranUI,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

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
          properties: pick(veteran.properties, ['maritalStatus', 'gender']),
        },
      },
    },
  },
};
