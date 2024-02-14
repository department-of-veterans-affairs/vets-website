import {
  applicantDemographicsDescription,
  applicantDemographicsSubHeader,
  veteranUI,
} from '../../utils/helpers';

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
