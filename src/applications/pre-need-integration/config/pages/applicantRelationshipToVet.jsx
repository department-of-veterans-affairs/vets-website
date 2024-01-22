import { merge } from 'lodash';

import {
  applicantInformationDescription,
  relationshipToVetTitleWrapperConst,
  RelationshipToVetDescriptionWrapper,
  relationshipToVetOption1TextWrapperConst,
} from '../../utils/helpers';

export const uiSchema = {
  application: {
    claimant: {
      'ui:description': RelationshipToVetDescriptionWrapper,
      relationshipToVet: {
        'ui:title': relationshipToVetTitleWrapperConst,
        'ui:options': relationshipToVetOption1TextWrapperConst,
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
