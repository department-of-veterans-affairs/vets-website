import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms/definitions/fullName';
import ApplicantDescription from 'platform/forms/components/ApplicantDescription';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { genderLabels } from 'platform/static-data/labels';

const {
  applicantFullName,
  applicantSocialSecurityNumber,
  dateOfBirth,
  applicantGender,
} = fullSchema.properties;

export const uiSchema = {
  'ui:description': ApplicantDescription,
  applicantFullName: fullNameUI,
  applicantSocialSecurityNumber: ssnUI,
  dateOfBirth: {
    ...currentOrPastDateUI('Date of birth'),
    'ui:errorMessages': {
      required: 'Please provide a valid date',
      futureDate: 'Please provide a valid date',
    },
  },
  applicantGender: {
    'ui:widget': 'radio',
    'ui:title': 'Gender',
    'ui:options': {
      labels: genderLabels,
    },
  },
};

export const schema = {
  required: ['applicantSocialSecurityNumber', 'dateOfBirth'],
  type: 'object',
  properties: {
    applicantFullName,
    applicantSocialSecurityNumber,
    dateOfBirth,
    applicantGender,
  },
};
