// import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge /* , pick */ } from 'lodash';

import { applicantInformationDescription } from '../../utils/helpers';

// const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    claimant: {
      'ui:title': ' ',
      relationshipToVet: {
        'ui:title':
          'What’s your relationship to the Veteran or service member you’re connected to?',
        'ui:options': {
          labels: {
            1: 'I’m the Veteran or service member',
            2: 'Husband',
            3: 'Wife',
            4: 'Adult dependent daughter',
            5: 'Adult dependent son',
            6: 'Adult dependent stepdaughter',
            7: 'Adult dependent stepson',
            8: 'Other',
          },
          widgetProps: {
            1: { 'aria-describedby': 'veteran-relationship' },
            2: { 'aria-describedby': 'spouse-relationship' },
            3: { 'aria-describedby': 'spouse-relationship' },
            4: { 'aria-describedby': 'child-relationship' },
            5: { 'aria-describedby': 'child-relationship' },
            6: { 'aria-describedby': 'child-relationship' },
            7: { 'aria-describedby': 'child-relationship' },
            8: { 'aria-describedby': 'other-relationship' },
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
            {
              relationshipToVet: {
                type: 'string',
                enum: ['1', '2', '3', '4', '5', '6', '7', '8'],
              },
            },
            // pick(claimant.properties, ['relationshipToVet']),
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
