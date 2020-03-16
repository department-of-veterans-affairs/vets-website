import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';

import { StudentNameHeader } from '../helpers';

const {
  countryDropdown,
  date,
  genericTextInput,
  genericNumberAndDashInput: numberAndDashInput,
} = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    studentAddress: {
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
    studentWasMarried: {
      type: 'boolean',
    },
    marriageDate: date,
    tuitionIsPaidByGovAgency: {
      type: 'boolean',
    },
    agencyName: genericTextInput,
    datePaymentsBegan: date,
  },
};

export const uiSchema = {
  'ui:title': StudentNameHeader,
  studentAddress: {
    'ui:title': 'Student’s address',
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
  studentWasMarried: {
    'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
    'ui:title': 'Was the student ever married?',
    'ui:widget': 'yesNo',
    'ui:errorMessages': { required: 'Please select an option' },
  },
  marriageDate: {
    ...currentOrPastDateUI('Date of marriage'),
    ...{
      'ui:required': formData => formData.studentWasMarried,
      'ui:options': {
        expandUnder: 'studentWasMarried',
        expandUnderCondition: true,
      },
    },
  },
  tuitionIsPaidByGovAgency: {
    'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
    'ui:title':
      'Is student’s tuition or education allowance being paid by the Survivor’s and Dependents’ Educational Assisatnce (DEA), the Federal Compensation Act, or any U.S. government agency or program?',
    'ui:widget': 'yesNo',
    'ui:errorMessages': { required: 'Please select an option' },
  },
  agencyName: {
    'ui:required': formData => formData.tuitionIsPaidByGovAgency,
    'ui:title': 'Agency name',
    'ui:options': {
      expandUnder: 'tuitionIsPaidByGovAgency',
      expandUnderCondition: true,
    },
    'ui:errorMessages': {
      required:
        'Please enter the goverment agency paying tuition or education allowance',
    },
  },
  datePaymentsBegan: {
    ...currentOrPastDateUI('Date payments began'),
    ...{
      'ui:required': formData => formData.tuitionIsPaidByGovAgency,
      'ui:options': {
        expandUnder: 'tuitionIsPaidByGovAgency',
        expandUnderCondition: true,
      },
    },
  },
};
