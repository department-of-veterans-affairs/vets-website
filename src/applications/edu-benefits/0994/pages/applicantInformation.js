import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

import ssnUI from '@department-of-veterans-affairs/platform-forms-system/ssn';
import fullNameUI from '@department-of-veterans-affairs/platform-forms/fullName';
import ApplicantDescription from '@department-of-veterans-affairs/platform-forms/ApplicantDescription';
import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';
import { genderLabels } from '@department-of-veterans-affairs/platform-static-data/labels';

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
