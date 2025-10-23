import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import _ from 'lodash';
import dateUI from 'platform/forms-system/src/js/definitions/date';
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

const programNameEntered = (formData, index) =>
  _.get(formData, `vetTecPrograms[${index}].programName`, '').trim() !== '';

const locationRequired = (formData, index) =>
  programNameEntered(formData, index) &&
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
        'ui:title': 'What’s the name of the program’s provider?',
      },
      programName: {
        'ui:title': 'What’s the name of the program?',
      },
      courseType: {
        'ui:title': 'Is it an in-person or online program?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            inPerson: 'In person',
            online: 'Online',
            both: 'Both online and in person',
          },
        },
        'ui:required': programNameEntered,
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
        'ui:required': locationRequired,
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
        'ui:required': locationRequired,
        'ui:options': {
          expandUnder: 'courseType',
          expandUnderCondition: checkLocation,
        },
      },
      plannedStartDate: {
        ...dateUI('What’s your estimated start date?'),
        'ui:required': programNameEntered,
      },
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
          plannedStartDate: {
            ...plannedStartDate,
            'ui:collapsed': true,
          },
        },
      },
    },
  },
};
