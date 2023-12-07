import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge, pick } from 'lodash';

import environment from 'platform/utilities/environment';

import {
  applicantInformationDescription,
  ApplicantDescriptionWrapper,
  childRelationshipDescription,
  otherRelationshipDescription,
  spouseRelationshipDescription,
  veteranRelationshipDescription,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = !environment.isProduction()
  ? {
      application: {
        claimant: {
          'ui:title': ' ',
          relationshipToVet: {
            'ui:title':
              'What is the applicant’s relationship to the service member or Veteran?',
            'ui:widget': 'radio',
            'ui:options': {
              labels: {
                1: 'Applicant is the service member or Veteran',
                2: 'Spouse or surviving spouse',
                3: 'Unmarried adult child',
                4: 'Other',
              },
              widgetProps: {
                1: { 'aria-describedby': 'veteran-relationship' },
                2: { 'aria-describedby': 'spouse-relationship' },
                3: { 'aria-describedby': 'child-relationship' },
                4: { 'aria-describedby': 'other-relationship' },
              },
            },
          },
          'view:applicantInformationDescription': {
            'ui:description': applicantInformationDescription,
            'ui:options': {
              displayEmptyObjectOnReview: true,
            },
          },
        },
      },
    }
  : {
      'ui:description': ApplicantDescriptionWrapper,
      application: {
        claimant: {
          relationshipToVet: {
            'ui:title': 'Relationship to service member',
            'ui:widget': 'radio',
            'ui:options': {
              labels: {
                1: 'I am the service member/Veteran',
                2: 'Spouse or surviving spouse',
                3: 'Unmarried adult child',
                4: 'Other',
              },
              widgetProps: {
                1: { 'aria-describedby': 'veteran-relationship' },
                2: { 'aria-describedby': 'spouse-relationship' },
                3: { 'aria-describedby': 'child-relationship' },
                4: { 'aria-describedby': 'other-relationship' },
              },
              nestedContent: {
                1: veteranRelationshipDescription,
                2: spouseRelationshipDescription,
                3: childRelationshipDescription,
                4: otherRelationshipDescription,
              },
            },
          },
        },
      },
    };
export const schema = !environment.isProduction()
  ? {
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
    }
  : {
      type: 'object',
      properties: {
        application: {
          type: 'object',
          properties: {
            claimant: {
              type: 'object',
              required: ['relationshipToVet'],
              properties: pick(claimant.properties, ['relationshipToVet']),
            },
          },
        },
      },
    };
