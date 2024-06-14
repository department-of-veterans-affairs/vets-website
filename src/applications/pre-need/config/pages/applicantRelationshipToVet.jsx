import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge, pick } from 'lodash';

import { applicantInformationDescription } from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
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
