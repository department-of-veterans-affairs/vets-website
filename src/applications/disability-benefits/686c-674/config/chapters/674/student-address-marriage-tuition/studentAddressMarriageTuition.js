import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';

import { StudentNameHeader } from '../helpers';
import { addressSchema, addressUISchema } from '../../../address-schema';

const { date, genericTextInput } = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    studentAddress: addressSchema,
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
  studentAddress: addressUISchema(true, 'studentAddress', 'report674'),
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
