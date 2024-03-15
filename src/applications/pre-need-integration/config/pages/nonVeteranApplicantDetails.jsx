import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { pick } from 'lodash';

import {
  nonVeteranApplicantDetailsDescription,
  nonVeteranApplicantDetailsSubHeader,
  ssnDashesUI,
  nonPreparerFullMaidenNameUI,
  nonPreparerDateOfBirthUI,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export function uiSchema(
  subHeader = nonVeteranApplicantDetailsSubHeader,
  description = nonVeteranApplicantDetailsDescription,
  nameUI = nonPreparerFullMaidenNameUI,
  ssnUI = ssnDashesUI,
  dateOfBirthUI = nonPreparerDateOfBirthUI,
) {
  return {
    application: {
      'ui:title': subHeader,
      'ui:description': description,
      claimant: {
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
          properties: pick(claimant.properties, ['name', 'ssn', 'dateOfBirth']),
        },
      },
    },
  },
};
