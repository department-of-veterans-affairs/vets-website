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
      // race (below) is going to be moved to the new screen 6 from MBMS-54135
      // race: {
      //   'ui:title':
      //     'Which categories best describe the sponsor? (You may check more than one.)',
      // },
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
          // 'race', was deleted from the line below
          required: ['maritalStatus', 'gender'],
          properties: pick(veteran.properties, [
            'maritalStatus',
            'gender',
            // 'race',
          ]),
        },
      },
    },
  },
};
