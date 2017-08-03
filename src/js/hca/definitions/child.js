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
      },
      childRelation: {
        // Missing in the schema -- not needed after vets-json-schema is upgraded to v2.7.0
        type: 'string'
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
    // Put the birth date before dependent date; it's opposite in the schema
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
    'ui:title': 'Child’s relationship to you'
  },
  childSocialSecurityNumber: _.merge(ssnUI, {
    'ui:title': 'Child’s social security number'
  }),
  childDateOfBirth: currentOrPastDateUI('Child’s date of birth'),
  childBecameDependent: _.assign(currentOrPastDateUI('Date child became dependent'), {
    'ui:validations': [
      validateDependentDate
    ]
  }),
  childDisabledBefore18: {
    'ui:title': 'Was child permanently and totally disabled before the age of 18?',
    'ui:widget': 'yesNo'
  },
  childAttendedSchoolLastYear: {
    'ui:title': 'If child is between 18 and 23 years of age, did child attend school during the last calendar year?',
    'ui:widget': 'yesNo'
  },
  childEducationExpenses: currencyUI('Expenses paid by your dependent child for college, vocational rehabilitation, or training (e.g., tuition, books, materials)'),
  childCohabitedLastYear: {
    'ui:title': 'Did your child live with you last year?',
    'ui:widget': 'yesNo'
  },
  'view:childSupportDescription': {
    'ui:description': 'Count child support contributions even if not paid in regular set amounts. Contributions can include tuition payments or payments of medical bills.'
  },
  childReceivedSupportLastYear: {
    'ui:title': 'If your dependent child did not live with you last year, did you provide support?',
    'ui:widget': 'yesNo',
    // TODO: Fix this once the bug mentioned below is fixed
    // Hide by default, only showing after hideIf is run and overrides this
    'ui:hidden': true,
    'ui:options': {
      // Not being invoked until the data is changed...which means this is open
      //  by default
      hideIf: (formData, index) => formData.children[index].childCohabitedLastYear !== false
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
