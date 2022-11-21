import * as address from 'platform/forms-system/src/js/definitions/address';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { applicantFields } from '../../definitions/constants';
import ApplicantField from '../../components/ApplicantField';
import fullSchema from '../../10-10D-schema.json';

const { applicants } = fullSchema.properties;

export default {
  uiSchema: {
    [applicantFields.parentObject]: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        [applicantFields.address]: address.uiSchema(),
        [applicantFields.fullName]: fullNameUI,
        [applicantFields.ssn]: ssnUI,
        [applicantFields.gender]: {
          'ui:title': 'Gender',
        },
        [applicantFields.email]: emailUI(),
        [applicantFields.phone]: phoneUI('Phone number'),
        [applicantFields.dob]: currentOrPastDateUI('Date of birth'),
        [applicantFields.isEnrolledInMedicare]: {
          'ui:title': 'Enrolled in Medicare?',
        },
        [applicantFields.hasOtherHealthInsurance]: {
          'ui:title': 'Other health insurance?',
        },
        [applicantFields.vetRelationship]: {
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
