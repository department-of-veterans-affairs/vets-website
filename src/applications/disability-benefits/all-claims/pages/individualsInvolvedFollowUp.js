import React from 'react';
import { ptsd781NameTitle } from '../content/ptsdClassification';
import {
  individualsInvolved,
  personDescriptionText,
} from '../content/individualsInvolved';
import fullNameUI from '../../../../platform/forms/definitions/fullName';
import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': individualsInvolved,
  [`incident${index}`]: {
    personInvolved: {
      'ui:title': 'hey',
      'ui:options': {
        itemName: 'Individual',
        viewField: ({ formData }) => <h5>hey</h5>,
      },
      items: {
        name: fullNameUI,
        personDescription: {
          'ui:title': personDescriptionText,
          'ui:widget': 'textarea',
        },
        'view:serviceMember': {
          'ui:title': 'Were they a Servicemember',
          'ui:widget': 'yesNo',
        },
        rank: {
          'ui:title': 'What was their rank at the time of the event?',
          'ui:options': {
            expandUnder: 'view:serviceMember',
            expandUnderCondition: true,
          },
        },
        unitAssigned: {
          'ui:title':
            'What unit were they assigned to at the time of the event?',
          'ui:options': {
            expandUnder: 'view:serviceMember',
            expandUnderCondition: true,
          },
        },
        injuryDeathDate: currentOrPastDateUI(
          'Date they were injured or killed',
        ),
        injuryDeath: {
          'ui:title': 'How were they injured or killed?',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              killedInAction: 'Killed in action',
              woundedInAction: 'Wounded in action',
              killedInNonBattle: 'Killed non-battle',
              injuredInNonBattle: 'Injured non-battle',
              other: 'Other',
            },
          },
        },
        injuryDeathOther: {
          'ui:title': ' ',
          'ui:options': {
            expandUnder: 'injuryDeath',
            expandUnderCondition: 'Other',
          },
        },
        'view:msggg': {
          'ui:title': ' ',
          'ui:description':
            'If anyone else was killed or injured in this event, you can add them now.',
        },
      },
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`incident${index}`]: {
      type: 'object',
      properties: {
        personInvolved: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                $ref: '#/definitions/fullName',
              },
              personDescription: {
                type: 'string',
              },
              'view:serviceMember': {
                type: 'boolean',
              },
              rank: {
                type: 'string',
              },
              unitAssigned: {
                type: 'string',
              },
              injuryDeathDate: {
                $ref: '#/definitions/date',
              },
              injuryDeath: {
                type: 'string',
                enum: [
                  'Killed in action',
                  'Killed non-battle',
                  'Wounded in action',
                  'Injured non-battle',
                  'Other',
                ],
              },
              injuryDeathOther: {
                type: 'string',
              },
              'view:msggg': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
});
