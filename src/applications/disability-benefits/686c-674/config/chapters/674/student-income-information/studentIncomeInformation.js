import { TASK_KEYS } from '../../../constants';
import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';
import { StudentNameHeader } from '../helpers';

const { currencyInput } = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    studentDoesEarnIncome: {
      type: 'boolean',
    },
    studentEarningsFromSchoolYear: {
      type: 'object',
      properties: {
        earningsFromAllEmployment: currencyInput,
        annualSocialSecurityPayments: currencyInput,
        otherAnnuitiesIncome: currencyInput,
        allOtherIncome: currencyInput,
      },
    },
    studentWillEarnIncomeNextYear: {
      type: 'boolean',
    },
    studentExpectedEarningsNextYear: {
      type: 'object',
      properties: {
        earningsFromAllEmployment: currencyInput,
        annualSocialSecurityPayments: currencyInput,
        otherAnnuitiesIncome: currencyInput,
        allOtherIncome: currencyInput,
      },
    },
  },
};

export const uiSchema = {
  'ui:title': StudentNameHeader,
  studentDoesEarnIncome: {
    'ui:required': formData =>
      isChapterFieldRequired(formData, TASK_KEYS.report674),
    'ui:title': 'Does the student earn an income',
    'ui:widget': 'yesNo',
  },
  studentEarningsFromSchoolYear: {
    'ui:title': 'Student’s income for the year attending school',
    'ui:options': {
      expandUnder: 'studentDoesEarnIncome',
      expandUnderCondition: true,
    },
    earningsFromAllEmployment: {
      'ui:title': 'Student’s earnings from all employment',
      'ui:required': formData => formData.studentDoesEarnIncome,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    annualSocialSecurityPayments: {
      'ui:title': 'Student’s annual Social Security payments',
      'ui:required': formData => formData.studentDoesEarnIncome,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    otherAnnuitiesIncome: {
      'ui:title': 'Student’s other annuities income',
      'ui:required': formData => formData.studentDoesEarnIncome,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    allOtherIncome: {
      'ui:title': 'All student’s other income',
      'ui:required': formData => formData.studentDoesEarnIncome,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
  },
  studentWillEarnIncomeNextYear: {
    'ui:title': 'Will the student earn an income next year?',
    'ui:widget': 'yesNo',
    'ui:required': formData =>
      isChapterFieldRequired(formData, TASK_KEYS.report674),
  },
  studentExpectedEarningsNextYear: {
    'ui:title': 'Student’s expected income for next year',
    'ui:options': {
      expandUnder: 'studentWillEarnIncomeNextYear',
      expandUnderCondition: true,
    },
    earningsFromAllEmployment: {
      'ui:title': 'Student’s earnings from all employment',
      'ui:required': formData => formData.studentWillEarnIncomeNextYear,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    annualSocialSecurityPayments: {
      'ui:title': 'Student’s annual Social Security payments',
      'ui:required': formData => formData.studentWillEarnIncomeNextYear,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    otherAnnuitiesIncome: {
      'ui:title': 'Student’s other annuities income',
      'ui:required': formData => formData.studentWillEarnIncomeNextYear,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    allOtherIncome: {
      'ui:title': 'All student’s other income',
      'ui:required': formData => formData.studentWillEarnIncomeNextYear,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
  },
};
