import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';

import {
  applicantDetailsCityTitle,
  applicantDetailsStateTitle,
  veteranApplicantDetailsSubHeader,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export function uiSchema(
  cityTitle = applicantDetailsCityTitle,
  stateTitle = applicantDetailsStateTitle,
) {
  return {
    application: {
      'ui:title': veteranApplicantDetailsSubHeader,
      veteran: {
        cityOfBirth: {
          'ui:title': cityTitle,
        },
        stateOfBirth: {
          'ui:title': stateTitle,
        },
      },
    },
  };
}

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          required: ['cityOfBirth', 'stateOfBirth'],
          properties: merge(
            {},
            pick(veteran.properties, ['cityOfBirth', 'stateOfBirth']),
          ),
        },
      },
    },
  },
};
