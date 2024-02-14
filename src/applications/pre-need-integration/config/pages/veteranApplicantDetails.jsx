import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { merge, pick } from 'lodash';

import {
  applicantDetailsDescription,
  applicantDetailsSubHeader,
  fullMaidenNameUI,
  ssnDashesUI,
  // applicantDetailsCityTitle,
  // applicantDetailsStateTitle,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export function uiSchema() {
  // cityTitle = applicantDetailsCityTitle,
  // stateTitle = applicantDetailsStateTitle,
  return {
    application: {
      'ui:title': applicantDetailsSubHeader,
      claimant: {
        'view:applicantDetailsDescription': {
          'ui:description': applicantDetailsDescription,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
        name: fullMaidenNameUI,
        ssn: ssnDashesUI,
        dateOfBirth: currentOrPastDateUI('Date of birth'),
      },
      veteran: {
        placeOfBirth: {
          'ui:title': 'Place of birth (city, state, territory)',
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
        claimant: {
          type: 'object',
          required: ['name', 'ssn', 'dateOfBirth'],
          properties: merge(
            {},
            {
              'view:applicantDetailsDescription': {
                type: 'object',
                properties: {},
              },
            },
            pick(claimant.properties, ['name', 'ssn', 'dateOfBirth']),
          ),
        },
        veteran: {
          type: 'object',
          required: ['placeOfBirth'],
          properties: {
            // placeOfBirth: pick(veteran.properties, ['placeOfBirth']),
            placeOfBirth: {
              type: 'string',
              maxLength: 100,
            },
          },
        },
      },
    },
  },
};
