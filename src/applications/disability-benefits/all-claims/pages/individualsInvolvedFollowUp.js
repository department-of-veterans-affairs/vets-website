import { ptsd781NameTitle } from '../content/ptsdClassification';
import {
  individualsDescription,
  personDescriptionText,
} from '../content/individualsInvolved';
import IndividualsInvolvedCard from '../components/IndividualsInvolvedCard';
import fullNameUI from '../../../../platform/forms/definitions/fullName';

import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': individualsDescription,
  [`incident${index}`]: {
    personsInvolved: {
      'ui:title': ' ',
      'ui:options': {
        itemName: 'Individual',
        viewField: IndividualsInvolvedCard,
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
          },
        },
        unitAssigned: {
          'ui:title':
            'What unit were they assigned to at the time of the event?',
          'ui:options': {
            expandUnder: 'view:serviceMember',
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
              killedNonBattle: 'Killed non-battle',
              injuredNonBattle: 'Injured non-battle',
              other: 'Other',
            },
          },
        },
        injuryDeathOther: {
          'ui:title': ' ',
          'ui:options': {
            expandUnder: 'injuryDeath',
            expandUnderCondition: 'other',
          },
        },
        'view:individualAddMsg': {
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
        personsInvolved: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'object',
                properties: {
                  first: {
                    type: 'string',
                  },
                  middle: {
                    type: 'string',
                  },
                  last: {
                    type: 'string',
                  },
                },
              },
              personDescription: {
                type: 'string',
              },
              'view:serviceMember': {
                type: 'boolean',
              },
              rank: {
                type: 'string',
                'ui:collapsed': true,
              },
              unitAssigned: {
                type: 'string',
                'ui:collapsed': true,
              },
              injuryDeathDate: {
                $ref: '#/definitions/date',
              },
              injuryDeath: {
                type: 'string',
                enum: [
                  'killedInAction',
                  'killedNonBattle',
                  'woundedInAction',
                  'injuredNonBattle',
                  'other',
                ],
              },
              injuryDeathOther: {
                type: 'string',
                'ui:collapsed': true,
              },
              'view:individualAddMsg': {
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
