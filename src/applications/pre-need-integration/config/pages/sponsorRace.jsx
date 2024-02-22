import { merge, pick } from 'lodash';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import {
  sponsorDemographicsDescription,
  sponsorDemographicsSubHeader,
  veteranUI,
  sponsorEthnicityTitle,
  sponsorRaceTitle,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

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
          properties: pick(veteran.properties, ['ethnicity', 'race']),
        },
      },
    },
  },
};
