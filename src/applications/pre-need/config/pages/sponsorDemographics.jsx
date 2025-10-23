import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

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
      gender: {
        'ui:title': 'What’s the sponsor’s sex?',
      },
      race: {
        'ui:title':
          'Which categories best describe the sponsor? (You may check more than one.)',
      },
      maritalStatus: {
        'ui:title': 'What’s the sponsor’s marital status?',
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
          required: ['gender', 'race', 'maritalStatus'],
          properties: pick(veteran.properties, [
            'gender',
            'race',
            'maritalStatus',
          ]),
        },
      },
    },
  },
};
