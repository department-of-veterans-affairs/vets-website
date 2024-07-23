import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { ptsd781NameTitle } from '../content/ptsdClassification';
import {
  individualsDescription,
  personDescriptionText,
} from '../content/individualsInvolved';
import IndividualsInvolvedCard from '../components/IndividualsInvolvedCard';

const {
  personsInvolved,
} = fullSchema.properties.form0781.properties.incidents.items.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': individualsDescription,
  [`incident${index}`]: {
    personsInvolved: {
      'ui:title': '',
      'ui:options': {
        viewField: IndividualsInvolvedCard,
        itemName: 'Person',
        title: 'New Person',
        reviewTitle: 'Persons Involved',
      },
      items: {
        'ui:order': [
          'name',
          'description',
          'view:serviceMember',
          'rank',
          'unitAssigned',
          'injuryDeathDate',
          'injuryDeath',
          'injuryDeathOther',
          'view:individualAddMsg',
        ],
        name: {
          first: {
            'ui:title': 'First name',
            'ui:autocomplete': 'off',
            'ui:errorMessages': {
              required: 'Please enter a first name',
            },
          },
          last: {
            'ui:title': 'Last name',
            'ui:autocomplete': 'off',
            'ui:errorMessages': {
              required: 'Please enter a last name',
            },
          },
          middle: {
            'ui:title': 'Middle name',
            'ui:autocomplete': 'off',
          },
        },
        description: {
          'ui:title': personDescriptionText,
          'ui:widget': 'textarea',
        },
        'view:serviceMember': yesNoUI({
          title: 'Were they a service member?',
        }),
        rank: {
          'ui:title': 'What was their rank at the time of the event?',
          'ui:options': {
            expandUnder: 'view:serviceMember',
          },
        },
        unitAssigned: {
          'ui:title':
            'What unit were they assigned to at the time of the event? (This could include their division, wing, battalion, cavalry, ship, etc.)',
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
          ...personsInvolved,
          items: {
            ...personsInvolved.items,
            properties: {
              ...personsInvolved.items.properties,
              rank: {
                ...personsInvolved.items.properties.rank,
                'ui:collapsed': true,
              },
              unitAssigned: {
                ...personsInvolved.items.properties.unitAssigned,
                'ui:collapsed': true,
              },
              injuryDeathOther: {
                ...personsInvolved.items.properties.injuryDeathOther,
                'ui:collapsed': true,
              },
              'view:serviceMember': yesNoSchema,
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
