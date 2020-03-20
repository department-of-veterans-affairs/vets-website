import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import { TASK_KEYS } from '../../../constants';
import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';
import { addressSchema } from '../../../address-schema';

import { StudentNameHeader } from '../helpers';

const { date, genericTextInput } = genericSchemas;

const nonMilitaryAddressSchema = obj => {
  const schema = cloneDeep(obj);
  delete schema.properties['view:livesOnMilitaryBase'];
  delete schema.properties['view:livesOnMilitaryBaseInfo'];
  return schema;
};

const addressSchemaObj = nonMilitaryAddressSchema(addressSchema);

export const schema = {
  type: 'object',
  properties: {
    studentDidAttendSchoolLastTerm: {
      type: 'boolean',
    },
    lastTermSchoolName: genericTextInput,
    lastTermSchoolAddress: addressSchemaObj,
    dateTermBegan: date,
    dateTermEnded: date,
    lastTermClassesPerWeek: {
      type: 'number',
    },
    lastTermHoursPerWeek: {
      type: 'number',
    },
  },
};

export const uiSchema = {
  'ui:title': StudentNameHeader,
  studentDidAttendSchoolLastTerm: {
    'ui:title': 'Did student attend school last term?',
    'ui:widget': 'yesNo',
    'ui:required': formData =>
      isChapterFieldRequired(formData, TASK_KEYS.report674),
  },
  lastTermSchoolName: {
    'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
    'ui:title': 'Last term school’s name',
    'ui:options': {
      expandUnder: 'studentDidAttendSchoolLastTerm',
      expandUnderCondition: true,
    },
  },
  lastTermSchoolAddress: {
    'ui:title': 'Last term school’s address',
    'ui:options': {
      expandUnder: 'studentDidAttendSchoolLastTerm',
      expandUnderCondition: true,
    },
    countryName: {
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      'ui:title': 'Country',
    },
    addressLine1: {
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      'ui:title': 'Street',
      'ui:errorMessages': {
        required: 'Street address is required',
        pattern: 'Street address must be under 100 characters',
      },
    },
    addressLine2: {
      'ui:title': 'Line 2',
    },
    addressLine3: {
      'ui:title': 'Line 3',
    },
    city: {
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      'ui:errorMessages': {
        required: 'City is required',
        pattern: 'City must be under 100 characters',
      },
    },
    stateCode: {
      'ui:required': formData =>
        formData?.lastTermSchoolAddress?.countryName === 'United States' &&
        formData.studentDidAttendSchoolLastTerm,
      'ui:title': 'State',
      'ui:errorMessages': {
        required: 'State is required',
      },
      'ui:options': {
        hideIf: formData =>
          formData?.lastTermSchoolAddress?.countryName !== 'United States',
      },
    },
    province: {
      'ui:title': 'State/Province/Region',
      'ui:options': {
        hideIf: formData =>
          formData?.lastTermSchoolAddress?.countryName === 'United States',
      },
    },
    zipCode: {
      'ui:required': formData =>
        formData?.lastTermSchoolAddress?.countryName === 'United States' &&
        formData.studentDidAttendSchoolLastTerm,
      'ui:title': 'Zip Code',
      'ui:errorMessages': {
        required: 'Zip code is required',
        pattern: 'Zip code must be 5 digits',
      },
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        hideIf: formData =>
          formData?.lastTermSchoolAddress?.countryName !== 'United States',
      },
    },
    internationalPostalCode: {
      'ui:required': formData =>
        formData?.lastTermSchoolAddress?.countryName !== 'United States' &&
        formData.studentDidAttendSchoolLastTerm,
      'ui:title': 'International postal code',
      'ui:errorMessages': {
        required: 'Postal code is required',
      },
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        hideIf: formData =>
          formData?.lastTermSchoolAddress?.countryName === 'United States',
      },
    },
  },
  dateTermBegan: {
    ...currentOrPastDateUI('Date term began'),
    ...{
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      'ui:options': {
        expandUnder: 'studentDidAttendSchoolLastTerm',
        expandUnderCondition: true,
      },
    },
  },
  dateTermEnded: {
    ...currentOrPastDateUI('Date term ended'),
    ...{
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      'ui:options': {
        expandUnder: 'studentDidAttendSchoolLastTerm',
        expandUnderCondition: true,
      },
    },
  },
  lastTermClassesPerWeek: {
    'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
    'ui:title': 'Number of classes a week',
    'ui:errorMessages': { required: 'Please enter a number' },
    'ui:options': {
      expandUnder: 'studentDidAttendSchoolLastTerm',
      expandUnderCondition: true,
    },
  },
  lastTermHoursPerWeek: {
    'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
    'ui:title': 'Hours a week',
    'ui:errorMessages': { required: 'Please enter a number' },
    'ui:options': {
      expandUnder: 'studentDidAttendSchoolLastTerm',
      expandUnderCondition: true,
    },
  },
};
