import * as address from 'platform/forms-system/src/js/definitions/address';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ApplicantField from '../components/ApplicantField';
import fullSchema from '../10-10D-schema.json';

const { applicants } = fullSchema.properties;

export default {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        address: address.uiSchema(),
        fullName: fullNameUI,
        ssnOrTin: ssnUI,
        gender: {
          'ui:title': 'Gender',
        },
        email: emailUI(),
        phoneNumber: phoneUI('Phone number'),
        dateOfBirth: currentOrPastDateUI('Date of birth'),
        isEnrolledInMedicare: {
          'ui:title': 'Enrolled in Medicare?',
        },
        hasOtherHealthInsurance: {
          'ui:title': 'Other health insurance?',
        },
        vetRelationship: {
          'ui:title': 'Veteran relationship',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      applicants,
    },
  },
};
