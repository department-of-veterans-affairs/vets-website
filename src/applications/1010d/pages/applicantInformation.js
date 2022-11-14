import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
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
        fullName: fullNameUI,
        ssnOrTin: ssnUI,
        gender: {
          'ui:title': 'Gender',
        },
        email: {
          'ui:title': 'Email',
        },
        phoneNumber: {
          ...phoneUI,
          'ui:title': 'Phone number',
        },
        dateOfBirth: {
          'ui:title': 'Date of birth',
        },
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
