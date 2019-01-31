import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import _ from 'lodash';
import dateUI from 'us-forms-system/lib/js/definitions/date';
import { trainingDescription } from '../content/trainingProgramsInformation';
import VetTecProgramView from '../components/VetTecProgramView';

const { plannedStartDate, vetTecProgramLocations } = fullSchema.properties;

export const uiSchema = {
  'ui:description': trainingDescription,
  vetTecProgram: {
    'ui:options': {
      itemName: 'Program',
      viewField: VetTecProgramView,
    },
    items: {
      providerName: {
        'ui:title':
          'Who is the provider of a program you’d like to attend? (For example: Amazon Web Services)',
      },
      programName: {
        'ui:title':
          'What’s the name of the program? (For example, AWS Media Services',
      },
      courseType: {
        'ui:title': 'Is this an in-person or online course?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            inPerson: 'In-person',
            online: 'Online',
            both: 'It’s both online and in-person',
          },
        },
      },
      vetTecProgramLocations: {
        'ui:description': 'Where will you take this training?',
        'ui:options': {
          expandUnder: 'courseType',
          hideIf: (formData, index) =>
            !(
              _.get(formData, `vetTecProgram[${index}].courseType`, '') ===
                'inPerson' ||
              _.get(formData, `vetTecProgram[${index}].courseType`, '') ===
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
    vetTecProgram: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          providerName: {
            type: 'string',
          },
          programName: {
            type: 'string',
          },
          courseType: {
            type: 'string',
            enum: ['inPerson', 'online', 'both'],
          },
          vetTecProgramLocations: {
            ...vetTecProgramLocations,
            'ui:collapsed': true,
          },
          plannedStartDate,
        },
      },
    },
  },
};
