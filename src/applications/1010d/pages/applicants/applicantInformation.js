import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { without, omit } from 'lodash';
import { applicantFields } from '../../definitions/constants';
import fullSchema from '../../10-10D-schema.json';

import ApplicantField from '../../components/ApplicantField';

const { required, properties } = fullSchema.properties.applicants.items;

export default {
  uiSchema: {
    [applicantFields.parentObject]: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
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
          'ui:widget': 'yesNo',
        },
        [applicantFields.hasOtherHealthInsurance]: {
          'ui:title': 'Other health insurance?',
          'ui:widget': 'yesNo',
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
      [applicantFields.parentObject]: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: without(required, applicantFields.address),
          properties: omit(properties, [applicantFields.address]),
        },
      },
    },
  },
};
