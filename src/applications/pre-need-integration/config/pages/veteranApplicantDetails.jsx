import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';

import {
  veteranApplicantDetailsSubHeader,
  nonPreparerFullMaidenNameUI,
  nonPreparerDateOfBirthUI,
  ssnDashesUI,
  // partial implementation of story resolving the address change:
  // applicantDetailsCityTitle,
  // applicantDetailsStateTitle,
} from '../../utils/helpers';

const {
  claimant,
  veteran,
} = fullSchemaPreNeed.properties.application.properties;

export function uiSchema(
  subHeader = veteranApplicantDetailsSubHeader,
  description = '',
  nameUI = nonPreparerFullMaidenNameUI,
  ssnUI = ssnDashesUI,
  dateOfBirthUI = nonPreparerDateOfBirthUI,
) {
  // partial implementation of story resolving the address change:
  // cityTitle = applicantDetailsCityTitle,
  // stateTitle = applicantDetailsStateTitle,
  return {
    application: {
      'ui:title': subHeader,
      claimant: {
        'view:applicantDetailsDescription': {
          'ui:description': description,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
        name: nameUI,
        ssn: ssnUI,
        dateOfBirth: dateOfBirthUI,
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
          properties: pick(veteran.properties, ['placeOfBirth']),
        },
      },
    },
  },
};
