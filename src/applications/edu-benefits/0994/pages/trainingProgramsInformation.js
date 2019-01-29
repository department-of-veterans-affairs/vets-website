import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import _ from 'lodash';
import dateUI from 'us-forms-system/lib/js/definitions/date';
import { trainingDescription } from '../content/trainingProgramsInformation';
import VetTecProgramView from '../components/VetTecProgramView';

const { vetTecPrograms } = fullSchema.properties;

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
      ...vetTecPrograms,
      items: {
        ...vetTecPrograms.items,
        properties: {
          ...vetTecPrograms.items.properties,
          providerName: {
            ...vetTecPrograms.items.properties.providerName,
          },
          programName: {
            ...vetTecPrograms.items.properties.programName,
          },
          courseType: {
            ...vetTecPrograms.items.properties.courseType,
          },
          location: {
            ...vetTecPrograms.items.properties.location,
            'ui:collapsed': true,
          },
          plannedStartDate: {
            ...vetTecPrograms.items.properties.plannedStartDate,
          },
        },
      },
    },
  },
};
