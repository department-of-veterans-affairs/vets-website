import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import environment from 'platform/utilities/environment';

import { merge, pick } from 'lodash';
import {
  sponsorDemographicsDescription,
  sponsorDemographicsSubHeader,
  veteranUI,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

// prod flag for MBMS-47182
export const uiSchema = !environment.isProduction()
  ? {
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
    }
  : {
      'ui:title': sponsorDemographicsSubHeader,
      'ui:description': sponsorDemographicsDescription,
      application: {
        veteran: merge({}, veteranUI, {
          gender: {
            'ui:title':
              "Sponsor's sex (information will be used for statistical purposes only)",
          },
          race: {
            'ui:title':
              'Which categories best describe your sponsor? (You may check more than one.)',
          },
          maritalStatus: {
            'ui:title': 'Sponsor’s marital status',
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
