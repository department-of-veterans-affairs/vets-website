import React from 'react';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import { report674 } from '../../../utilities';

export const schema = report674.properties.studentIncomeInformation;

export const uiSchema = {
  studentDoesEarnIncome: {
    'ui:required': formData =>
      isChapterFieldRequired(formData, TASK_KEYS.report674),
    'ui:title': 'Does the student earn an income now?',
    'ui:widget': 'yesNo',
  },
  studentEarningsFromSchoolYear: {
    'ui:title': 'Student’s income for the year attending school',
    'ui:description': (
      <p>
        Enter the amounts before any deductions, like taxes and insurance.{' '}
        <strong>If there is no dollar amount, enter 0.</strong>
      </p>
    ),
    'ui:options': {
      expandUnder: 'studentDoesEarnIncome',
      expandUnderCondition: true,
    },
    earningsFromAllEmployment: {
      'ui:title': 'Student’s earnings from all employment',
      'ui:required': formData => formData.studentDoesEarnIncome,
      'ui:errorMessages': {
        required: 'Enter a value',
        pattern: 'Enter a number',
      },
    },
    annualSocialSecurityPayments: {
      'ui:title': 'Student’s annual Social Security payments',
      'ui:required': formData => formData.studentDoesEarnIncome,
      'ui:errorMessages': {
        required: 'Enter a value',
        pattern: 'Enter a number',
      },
    },
    otherAnnuitiesIncome: {
      'ui:title': 'Student’s other annuities income',
      'ui:required': formData => formData.studentDoesEarnIncome,
      'ui:errorMessages': {
        required: 'Enter a value',
        pattern: 'Enter a number',
      },
    },
    allOtherIncome: {
      'ui:title': 'All student’s other income',
      'ui:required': formData => formData.studentDoesEarnIncome,
      'ui:errorMessages': {
        required: 'Enter a value',
        pattern: 'Enter a number',
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
    'ui:description': (
      <p>
        Enter the amounts before any deductions, like taxes and insurance.{' '}
        <strong>If there is no dollar amount, enter 0.</strong>
      </p>
    ),
    'ui:options': {
      expandUnder: 'studentWillEarnIncomeNextYear',
      expandUnderCondition: true,
    },
    earningsFromAllEmployment: {
      'ui:title': 'Student’s earnings from all employment',
      'ui:required': formData => formData.studentWillEarnIncomeNextYear,
      'ui:errorMessages': {
        required: 'Enter a value',
        pattern: 'Enter a number',
      },
    },
    annualSocialSecurityPayments: {
      'ui:title': 'Student’s annual Social Security payments',
      'ui:required': formData => formData.studentWillEarnIncomeNextYear,
      'ui:errorMessages': {
        required: 'Enter a value',
        pattern: 'Enter a number',
      },
    },
    otherAnnuitiesIncome: {
      'ui:title': 'Student’s other annuities income',
      'ui:required': formData => formData.studentWillEarnIncomeNextYear,
      'ui:errorMessages': {
        required: 'Enter a value',
        pattern: 'Enter a number',
      },
    },
    allOtherIncome: {
      'ui:title': 'All student’s other income',
      'ui:required': formData => formData.studentWillEarnIncomeNextYear,
      'ui:errorMessages': {
        required: 'Enter a value',
        pattern: 'Enter a number',
      },
    },
  },
};
