import { merge } from 'lodash';
import {
  applicantDemographicsDescription,
  applicantDemographicsSubHeader,
  veteranUI,
  applicantDemographicsEthnicityTitle,
  applicantDemographicsRaceTitle,
} from '../../utils/helpers';

export function uiSchema(
  ethnicityTitle = applicantDemographicsEthnicityTitle,
  raceTitle = applicantDemographicsRaceTitle,
) {
  return {
    application: {
      'ui:title': applicantDemographicsSubHeader,
      'view:applicantDemographicsDescription': {
        'ui:description': applicantDemographicsDescription,
        'ui:options': {
          displayEmptyObjectOnReview: true,
        },
      },
      veteran: merge({}, veteranUI, {
        ethnicity: { 'ui:title': ethnicityTitle },
        race: { 'ui:title': raceTitle },
      }),
    },
  };
}
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
          // properties: pick(veteran.properties, ['ethnicity','race']),
          properties: {
            ethnicity: {
              type: 'string',
              enum: [
                'isSpanishHispanicLatino',
                'notSpanishHispanicLatino',
                'unknown',
                'na',
              ],
            },
            race: {
              type: 'object',
              properties: {
                isAmericanIndianOrAlaskanNative: {
                  type: 'boolean',
                },
                isAsian: {
                  type: 'boolean',
                },
                isBlackOrAfricanAmerican: {
                  type: 'boolean',
                },
                isNativeHawaiianOrOtherPacificIslander: {
                  type: 'boolean',
                },
                isWhite: {
                  type: 'boolean',
                },
                isOther: {
                  type: 'boolean',
                },
                na: {
                  type: 'boolean',
                },
              },
            },
          },
        },
      },
    },
  },
};

// import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

// import { merge, pick } from 'lodash';
// import {
//   // sponsorDemographicsDescription,
//   // sponsorDemographicsSubHeader,
//   veteranUI,
// } from '../../utils/helpers';

// const { veteran } = fullSchemaPreNeed.properties.application.properties;

// export const uiSchema = {
//   // 'ui:title': sponsorDemographicsSubHeader,
//   // 'ui:description': sponsorDemographicsDescription,
//   application: {
//     veteran: merge({}, veteranUI, {
//       race: {
//         'ui:title':
//           'Which categories best describe the sponsor? (You may check more than one.)',
//       },
//     }),
//   },
// };

// export const schema = {
//   type: 'object',
//   properties: {
//     application: {
//       type: 'object',
//       properties: {
//         veteran: {
//           type: 'object',
//           required: ['race'],
//           properties: pick(veteran.properties, ['race']),
//         },
//       },
//     },
//   },
// };
