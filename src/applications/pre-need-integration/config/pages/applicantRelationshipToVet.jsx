import { merge } from 'lodash';

import {
  applicantInformationDescription,
  relationshipToVetDescription,
  relationshipToVetOptions,
} from '../../utils/helpers';

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
            {
              relationshipToVet: {
                type: 'string',
                enum: ['1', '2', '3', '4', '5', '6', '7', '8'],
              },
            },
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
