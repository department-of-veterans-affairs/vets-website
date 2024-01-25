import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';

import {
  applicantInformationDescription,
  relationshipToVetDescription,
  relationshipToVetOptions,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export function uiSchema(
  description = relationshipToVetDescription,
  title = relationshipToVetDescription,
  options = relationshipToVetOptions,
) {
  return {
    application: {
      claimant: {
        'ui:description': description,
        relationshipToVet: {
          'ui:title': title,
          'ui:options': options,
        },
        'view:applicantInformationDescription': {
          'ui:description': applicantInformationDescription,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
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
          required: ['relationshipToVet'],
          properties: merge(
            {},
            pick(claimant.properties, ['relationshipToVet']),
            {
              'view:applicantInformationDescription': {
                type: 'object',
                properties: {},
              },
            },
          ),
        },
      },
    },
  },
};
