import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { countries } from 'vets-json-schema/dist/constants.json';
import environment from 'platform/utilities/environment';

import {
  schoolStudentIdTitle,
  stemApplicantSco,
} from '../content/programDetails';
import { updateProgramDetailsSchema } from '../helpers';

const {
  degreeName,
  schoolName,
  schoolCity,
  schoolState,
  schoolStudentId,
  schoolEmailAddress,
} = fullSchema10203.properties;

export const uiSchema = {
  'ui:title': 'STEM degree and institution details',
  'ui:options': {
    updateSchema: updateProgramDetailsSchema(),
  },
  'ui:order': [
    'degreeName',
    'schoolName',
    'schoolCountry',
    'schoolCity',
    'schoolState',
    'view:field',
    'schoolStudentId',
    'schoolEmailAddress',
    'view:stemApplicantSco',
  ],
  degreeName: {
    'ui:title': "What's the name of your STEM degree?",
  },
  // prod flag 24612
  schoolName: {
    'ui:title': environment.isProduction()
      ? 'What’s the name of the school where you plan on using the Rogers STEM Scholarship?'
      : 'What’s the name of the school or training institution where you plan on using the Rogers STEM Scholarship?',
  },
  schoolCity: {
    'ui:title': 'City',
  },
  schoolCountry: {
    'ui:title': 'Country',
  },
  'view:field': {
    'ui:description': schoolStudentIdTitle,
    'ui:options': {
      hideOnReview: true,
    },
  },
  schoolStudentId: {
    'ui:title': environment.isProduction()
      ? 'Your school student ID number'
      : 'Your student ID number',
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
  },
  schoolEmailAddress: {
    ...emailUI(),
    'ui:title': environment.isProduction()
      ? 'Your school email address (This email address usually ends with .edu)'
      : 'Your student email address (This email address usually ends with .edu)',
  },
  'view:stemApplicantSco': {
    'ui:description': environment.isProduction() ? null : stemApplicantSco,
  },
};

export const schema = {
  type: 'object',
  required: ['degreeName', 'schoolName', 'schoolCity', 'schoolCountry'],
  properties: {
    degreeName,
    schoolName,
    schoolCity,
    schoolState,
    schoolCountry: {
      default: 'USA',
      type: 'string',
      enum: countries.map(country => country.value),
      enumNames: countries.map(country => country.label),
    },
    'view:field': {
      type: 'object',
      properties: {},
    },
    schoolStudentId,
    schoolEmailAddress,
    'view:stemApplicantSco': {
      type: 'object',
      properties: {},
    },
  },
};
