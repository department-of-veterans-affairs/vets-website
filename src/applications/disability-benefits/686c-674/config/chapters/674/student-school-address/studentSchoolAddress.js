import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';

import { StudentNameHeader } from '../helpers';

const {
  countryDropdown,
  genericTextInput,
  genericNumberAndDashInput: numberAndDashInput,
} = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    schoolInformation: {
      type: 'object',
      properties: {
        schoolName: genericTextInput,
        trainingProgram: genericTextInput,
      },
    },
    schoolAddress: {
      type: 'object',
      properties: {
        country: countryDropdown,
        street: genericTextInput,
        line2: genericTextInput,
        line3: genericTextInput,
        city: genericTextInput,
        state: genericTextInput,
        postalCode: numberAndDashInput,
      },
    },
  },
};

export const uiSchema = {
  'ui:title': StudentNameHeader,
  schoolInformation: {
    'ui:title': 'School student will attend',
    schoolName: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'School’s name',
      'ui:errorMessages': { required: 'Please enter a school name' },
    },
    trainingProgram: {
      'ui:title': 'Kind of training or educational program',
    },
  },
  schoolAddress: {
    'ui:title': 'School’s address',
    country: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'Country',
      'ui:errorMessages': { required: 'Please select a country' },
    },
    street: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'Street',
      'ui:errorMessages': { required: 'Please enter a street address' },
    },
    line2: {
      'ui:title': 'Line 2',
    },
    line3: {
      'ui:title': 'Line 3',
    },
    city: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'City',
      'ui:errorMessages': { required: 'Please enter a city' },
    },
    state: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'State',
      'ui:errorMessages': { required: 'Please enter a state' },
    },
    postalCode: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
      'ui:title': 'Postal code',
      'ui:errorMessages': { required: 'Please enter a postal code' },
    },
  },
};
