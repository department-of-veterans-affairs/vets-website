import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { ssnSchema } from 'platform/forms-system/src/js/web-component-patterns';

import { merge, pick } from 'lodash';

import {
  veteranApplicantDetailsSubHeader,
  nonPreparerFullMaidenNameUI,
  nonPreparerDateOfBirthUI,
  ssnDashesUI,
  veteranApplicantDetailsSummary,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export function uiSchema(
  subHeader = veteranApplicantDetailsSubHeader,
  description = '',
  nameUI = nonPreparerFullMaidenNameUI,
  ssnUI = ssnDashesUI,
  dateOfBirthUI = nonPreparerDateOfBirthUI,
) {
  return {
    'ui:title': (formContext, formData) =>
      veteranApplicantDetailsSummary(formContext, formData),
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
            pick(claimant.properties, ['name']),
            {
              ssn: ssnSchema,
            },
            pick(claimant.properties, ['dateOfBirth']),
          ),
        },
      },
    },
  },
};
