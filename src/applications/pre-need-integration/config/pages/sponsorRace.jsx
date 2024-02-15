import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge, pick } from 'lodash';
import {
  // sponsorDemographicsDescription,
  // sponsorDemographicsSubHeader,
  veteranUI,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  // 'ui:title': sponsorDemographicsSubHeader,
  // 'ui:description': sponsorDemographicsDescription,
  application: {
    veteran: merge({}, veteranUI, {
      race: {
        'ui:title':
          'Which categories best describe the sponsor? (You may check more than one.)',
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
          required: ['race'],
          properties: pick(veteran.properties, ['race']),
        },
      },
    },
  },
};
