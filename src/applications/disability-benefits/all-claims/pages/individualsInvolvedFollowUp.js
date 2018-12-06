import { ptsd781NameTitle } from '../content/ptsdClassification';
import {
  individualsDescription,
  personDescriptionText,
} from '../content/individualsInvolved';
import IndividualsInvolvedCard from '../components/IndividualsInvolvedCard';
import fullNameUI from '../../../../platform/forms/definitions/fullName';

import _ from '../../../../platform/utilities/data';
import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': individualsDescription,
  [`incident${index}`]: {
    personInvolved: {
      'ui:title': ' ',
      'ui:options': {
        itemName: 'Individual',
        viewField: IndividualsInvolvedCard,
      },
      items: {
        'ui:options': {
          updateSchema: (formData, schema, itemsUISchema, itemIndex) => {
            let schemaProps = schema.properties;
            const serviceMemberSelected = _.get(
              [
                `incident${index}`,
                'personInvolved',
                itemIndex,
                'view:serviceMember',
              ],
              formData,
              false,
            );
            const injuryOtherSelected =
              _.get(
                [
                  `incident${index}`,
                  'personInvolved',
                  itemIndex,
                  'injuryDeath',
                ],
                formData,
                '',
              ) === 'Other';

            if (serviceMemberSelected) {
              schemaProps = {
                ...schemaProps,
                rank: {
                  type: 'string',
                },
                unitAssigned: {
                  type: 'string',
                },
              };
            }

            if (injuryOtherSelected) {
              schemaProps.injuryDeathOther = {
                type: 'string',
              };
            }
            return { ...schema, properties: schemaProps };
          },
        },
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
