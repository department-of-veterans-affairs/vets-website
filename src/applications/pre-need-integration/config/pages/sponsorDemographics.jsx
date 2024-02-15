// This will be used again once the changes are made in the json-schema
// import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

// pick will need to be added back to this 'lodash' import
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
          // Below will updated once the json-schema stuff is updated and merged
          // properties: pick(veteran.properties, ['maritalStatus', 'gender']),
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
