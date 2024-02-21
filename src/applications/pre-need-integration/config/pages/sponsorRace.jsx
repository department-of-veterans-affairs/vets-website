import { merge } from 'lodash';

import {
  sponsorDemographicsDescription,
  sponsorDemographicsSubHeader,
  veteranUI,
  sponsorEthnicityTitle,
  sponsorRaceTitle,
} from '../../utils/helpers';

export function uiSchema(
  ethnicityTitle = sponsorEthnicityTitle,
  raceTitle = sponsorRaceTitle,
) {
  return {
    application: {
      'ui:title': sponsorDemographicsSubHeader,
      'view:sponsorDemographicsDescription': {
        'ui:description': sponsorDemographicsDescription,
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
        'view:sponsorDemographicsDescription': {
          type: 'object',
          properties: {},
        },
        veteran: {
          type: 'object',
          required: ['ethnicity', 'race'],
          // Keeping this commented out line below for now while this gets merged along with schema changes in vets-json-schema
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
