import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';

import {
  veteranApplicantDetailsSubHeader,
  nonPreparerFullMaidenNameUI,
  nonPreparerDateOfBirthUI,
  ssnDashesUI,
  applicantDetailsCityTitle,
  applicantDetailsStateTitle,
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
  cityTitle = applicantDetailsCityTitle,
  stateTitle = applicantDetailsStateTitle,
) {
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
