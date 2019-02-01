import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import _ from 'lodash';
import dateUI from 'us-forms-system/lib/js/definitions/date';
import { trainingDescription } from '../content/trainingProgramsInformation';
import VetTecProgramView from '../components/VetTecProgramView';

const {
  providerName,
  programName,
  courseType,
  location,
  plannedStartDate,
} = fullSchema.properties.vetTecPrograms.items.properties;

export const uiSchema = {
  'ui:description': trainingDescription,
  vetTecPrograms: {
    'ui:options': {
      itemName: 'Program',
      viewField: VetTecProgramView,
    },
    items: {
      providerName: {
        'ui:title':
          'What’s the name of the provider of the program you’d like to attend?',
      },
      programName: {
        'ui:title': 'What’s the name of the program?',
      },
      courseType: {
        'ui:title': 'Is the training in-person or online?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            inPerson: 'In-person',
            online: 'Online',
            both: 'It’s both online and in-person',
          },
        },
      },
      location: {
        'ui:description': 'Where will you take this training?',
        'ui:options': {
          expandUnder: 'courseType',
          hideIf: (formData, index) =>
            !(
              _.get(formData, `vetTecPrograms[${index}].courseType`, '') ===
                'inPerson' ||
              _.get(formData, `vetTecPrograms[${index}].courseType`, '') ===
                'both'
            ),
        },
        city: {
          'ui:title': 'City',
        },
        state: {
          'ui:title': 'State',
        },
      },
      plannedStartDate: dateUI('What is your estimated start date?'),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    vetTecPrograms: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          providerName,
          programName,
          courseType,
          location: {
            ...location,
            'ui:collapsed': true,
          },
          plannedStartDate,
        },
      },
    },
  },
};
