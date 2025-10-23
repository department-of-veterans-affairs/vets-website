/* eslint-disable prefer-destructuring */
import { merge, pick } from 'lodash';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { validateDependentDate } from '../validation';

const incomeFields = ['grossIncome', 'netIncome', 'otherIncome'];

export const createDependentSchema = hcaSchema => {
  const schema = merge({}, hcaSchema.definitions.dependent, {
    required: [
      'dependentRelation',
      'socialSecurityNumber',
      'dateOfBirth',
      'becameDependent',
      'dependentEducationExpenses',
      'disabledBefore18',
      'cohabitedLastYear',
    ],
  });

  schema.properties = omit(incomeFields, schema.properties);

  return schema;
};

export const createDependentIncomeSchema = hcaSchema => {
  const dependent = hcaSchema.definitions.dependent;
  return {
    ...dependent,
    properties: pick(dependent.properties, incomeFields),
    required: incomeFields,
  };
};

export const uiSchema = {
  'ui:order': [
    'fullName',
    'dependentRelation',
    'socialSecurityNumber',
    // Put the birth date before dependent date; it’s opposite in the schema
    'dateOfBirth',
    'becameDependent',
    'disabledBefore18',
    'attendedSchoolLastYear',
    'dependentEducationExpenses',
    'cohabitedLastYear',
    'receivedSupportLastYear',
  ],
  fullName: {
    ...fullNameUI,
    first: {
      'ui:title': 'Dependent\u2019s first name',
    },
    last: {
      'ui:title': 'Dependent\u2019s last name',
    },
    middle: {
      'ui:title': 'Dependent\u2019s middle name',
    },
    suffix: {
      'ui:title': 'Dependent\u2019s suffix',
    },
  },
  dependentRelation: {
    'ui:title': 'What\u2019s your dependent\u2019s relationship to you?',
  },
  socialSecurityNumber: {
    ...ssnUI,
    'ui:title': 'Dependent\u2019s Social Security number',
  },
  dateOfBirth: currentOrPastDateUI('Dependent’s date of birth'),
  becameDependent: {
    ...currentOrPastDateUI('When did they become your dependent?'),
    'ui:validations': [validateDependentDate],
  },

  disabledBefore18: {
    'ui:title':
      'Was your dependent permanently and totally disabled before the age of 18?',
    'ui:widget': 'yesNo',
  },
  attendedSchoolLastYear: {
    'ui:title':
      'If your dependent is between 18 and 23 years of age, did they attend school during the last calendar year?',
    'ui:widget': 'yesNo',
  },
  dependentEducationExpenses: currencyUI(
    'Expenses your dependent paid for college, vocational rehabilitation, or training (e.g., tuition, books, materials)',
  ),
  cohabitedLastYear: {
    'ui:title': 'Did your dependent live with you last year?',
    'ui:widget': 'yesNo',
  },
  receivedSupportLastYear: {
    'ui:title':
      'If your dependent didn’t live with you last year, did you provide support? (Please count all support contributions even if they weren’t paid in regular and set amounts. Support can include tuition or medical bill payments.)',
    'ui:widget': 'yesNo',
    // TODO: Fix this once the bug mentioned below is fixed
    // Hide by default, only showing after hideIf is run and overrides this
    'ui:hidden': true,
    'ui:options': {
      // Not being invoked until the data is changed...which means this is open
      //  by default
      hideIf: (formData, index) =>
        get(`dependents[${index}].cohabitedLastYear`, formData) !== false,
    },
  },
};

export const dependentIncomeUiSchema = {
  grossIncome: currencyUI(
    'Dependent\u2019s gross annual income from employment',
  ),
  netIncome: currencyUI(
    'Dependent\u2019s net income from farm, ranch, property or business',
  ),
  otherIncome: currencyUI('Dependent\u2019s other income amount'),
  'ui:options': {
    updateSchema: (formData, schema, ui, index) => {
      const name = get(`dependents.[${index}].fullName`, formData);
      if (name) {
        return {
          title: `${name.first} ${name.last} income`,
        };
      }

      return schema;
    },
  },
};
