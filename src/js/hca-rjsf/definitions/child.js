import _ from 'lodash/fp';
import { uiSchema as fullNameUI } from '../../common/schemaform/definitions/fullName';
import { uiSchema as ssnUI } from '../../common/schemaform/definitions/ssn';


export const schema = (hcaSchema) => {
  return _.merge(_.omit(
      // Seems we don't need these properties...
      ['properties.grossIncome', 'properties.netIncome', 'properties.otherIncome'],
      hcaSchema.definitions.child
    ), {
      required: [
        'childRelation',
        'childSocialSecurityNumber',
        'childDateOfBirth',
        'childBecameDependent',
        'childEducationExpenses'
      ],
      properties: {
        'view:childSupportDescription': {
          type: 'object',
          properties: {}
        },
        childRelation: {
          // Missing in the schema
          type: 'string'
        }
      }
    }
  );
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
  childDateOfBirth: {
    'ui:title': 'Child’s date of birth'
  },
  childBecameDependent: {
    'ui:title': 'Date child became dependent'
  },
  childDisabledBefore18: {
    'ui:title': 'Was child permanently and totally disabled before the age of 18?',
    'ui:widget': 'yesNo'
  },
  childAttendedSchoolLastYear: {
    'ui:title': 'If child is between 18 and 23 years of age, did child attend school during the last calendar year?',
    'ui:widget': 'yesNo'
  },
  childEducationExpenses: {
    'ui:title': 'Expenses paid by your dependent child for college, vocational rehabilitation, or training (e.g., tuition, books, materials)?'
  },
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
    'ui:options': {
      // Not being invoked until the data is changed...which means this is open
      //  by default
      hideIf: (formData, index) => formData.children[index].childCohabitedLastYear !== false
    }
  }
};
