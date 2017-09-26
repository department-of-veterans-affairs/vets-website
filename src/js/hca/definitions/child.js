import _ from 'lodash/fp';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import ssnUI from '../../common/schemaform/definitions/ssn';
import currencyUI from '../../common/schemaform/definitions/currency';
import { validateDependentDate } from '../validation';

const incomeFields = [
  'grossIncome',
  'netIncome',
  'otherIncome'
];

export const createChildSchema = (hcaSchema) => {
  const s = _.merge(hcaSchema.definitions.child, {
    required: [
      'childRelation',
      'childSocialSecurityNumber',
      'childDateOfBirth',
      'childBecameDependent',
      'childEducationExpenses',
      'childDisabledBefore18',
      'childCohabitedLastYear'
    ],
    properties: {
      'view:childSupportDescription': {
        type: 'object',
        properties: {}
      }
    }
  });

  s.properties = _.omit(incomeFields, s.properties);

  return s;
};

export const createChildIncomeSchema = (hcaSchema) => {
  const child = hcaSchema.definitions.child;
  return _.assign(child, {
    properties: _.pick(incomeFields, child.properties),
    required: incomeFields
  });
};

export const uiSchema = {
  'ui:order': [
    'childFullName',
    'childRelation',
    'childSocialSecurityNumber',
    // Put the birth date before dependent date; it’s opposite in the schema
    'childDateOfBirth',
    'childBecameDependent',
    'childDisabledBefore18',
    'childAttendedSchoolLastYear',
    'childEducationExpenses',
    'childCohabitedLastYear',
    'view:childSupportDescription',
    'childReceivedSupportLastYear'
  ],
  childFullName: fullNameUI,
  childRelation: {
    'ui:title': 'Dependent’s relationship to you?'
  },
  childSocialSecurityNumber: _.merge(ssnUI, {
    'ui:title': 'Dependent’s Social Security number'
  }),
  childDateOfBirth: currentOrPastDateUI('Dependent’s date of birth'),
  childBecameDependent: _.assign(currentOrPastDateUI('Date they became your dependent?'), {
    'ui:validations': [
      validateDependentDate
    ]
  }),
  childDisabledBefore18: {
    'ui:title': 'Was your dependent permanently and totally disabled before the age of 18?',
    'ui:widget': 'yesNo'
  },
  childAttendedSchoolLastYear: {
    'ui:title': 'If your dependent is between 18 and 23 years of age, did they attend school during the last calendar year?',
    'ui:widget': 'yesNo'
  },
  childEducationExpenses: currencyUI('Expenses your dependent paid for college, vocational rehabilitation, or training (e.g., tuition, books, materials)'),
  childCohabitedLastYear: {
    'ui:title': 'Did your dependent live with you last year?',
    'ui:widget': 'yesNo'
  },
  'view:childSupportDescription': {
    'ui:description': 'Please count all support contributions even if they weren’t paid in regular and set amounts. Support can include tuition or medical bill payments.'
  },
  childReceivedSupportLastYear: {
    'ui:title': 'If your dependent didn’t live with you last year, did you provide support?',
    'ui:widget': 'yesNo',
    // TODO: Fix this once the bug mentioned below is fixed
    // Hide by default, only showing after hideIf is run and overrides this
    'ui:hidden': true,
    'ui:options': {
      // Not being invoked until the data is changed...which means this is open
      //  by default
      hideIf: (formData, index) => _.get(`children[${index}].childCohabitedLastYear`, formData) !== false
    }
  },
};

export const childIncomeUiSchema = {
  grossIncome: currencyUI('Gross annual income from employment'),
  netIncome: currencyUI('Net income from farm, ranch, property or business'),
  otherIncome: currencyUI('Other income amount'),
  'ui:options': {
    updateSchema: (formData, schema, ui, index) => {
      const name = _.get(`children.[${index}].childFullName`, formData);
      if (name) {
        return {
          title: `${name.first} ${name.last} income`
        };
      }

      return schema;
    }
  }
};
