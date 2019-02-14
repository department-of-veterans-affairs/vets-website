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

const getCourseType = (formData, index) =>
  _.get(formData, `vetTecPrograms[${index}].courseType`, '');

const checkLocation = field => field === 'inPerson' || field === 'both';

const showLocation = (formData, index) =>
  checkLocation(getCourseType(formData, index));

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
      'view:location': {
        'ui:title': ' ',
        'ui:description': 'Where will you take this training?',
        'ui:options': {
          expandUnder: 'courseType',
          expandUnderCondition: checkLocation,
        },
      },
      locationCity: {
        'ui:title': 'City',
        'ui:required': (formData, index) => showLocation(formData, index),
        'ui:errorMessages': {
          pattern: 'Please fill in a valid city',
        },
        'ui:options': {
          expandUnder: 'courseType',
          expandUnderCondition: checkLocation,
        },
      },
      locationState: {
        'ui:title': 'State',
        'ui:errorMessages': {
          pattern: 'Please select a valid state',
        },
        'ui:required': (formData, index) => showLocation(formData, index),
        'ui:options': {
          expandUnder: 'courseType',
          expandUnderCondition: checkLocation,
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
        required: ['plannedStartDate'],
        properties: {
          providerName,
          programName,
          courseType,
          'view:location': {
            type: 'object',
            properties: {},
            'ui:collapsed': true,
          },
          locationCity: {
            ...location.properties.city,
            'ui:collapsed': true,
          },
          locationState: {
            ...location.properties.state,
            'ui:collapsed': true,
          },
          plannedStartDate,
        },
      },
    },
  },
};
