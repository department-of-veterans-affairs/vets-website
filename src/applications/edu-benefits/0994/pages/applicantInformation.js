import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms/definitions/fullName';
import ApplicantDescription from 'platform/forms/components/ApplicantDescription';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { genderLabels } from 'platform/static-data/labels';
import environment from 'platform/utilities/environment';
import { validateApplicantName } from '../validations';

import { ApplicantInformation } from '../components/ApplicantInformation';

const {
  applicantFullName,
  applicantSocialSecurityNumber,
  dateOfBirth,
  applicantGender,
} = fullSchema.properties;

export const uiSchema = () => {
  if (!environment.isProduction()) {
    return {
      'ui:description': ApplicantDescription,
      applicantFullName: {
        ...fullNameUI,
        'ui:validations': [validateApplicantName],
      },
      applicantSocialSecurityNumber: ssnUI,
      dateOfBirth: {
        ...currentOrPastDateUI('Date of birth'),
        'ui:errorMessages': {
          pattern: 'Please provide a valid date',
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
  }

  return {
    'ui:field': ApplicantInformation,
  };
};

export const schema = () => {
  if (!environment.isProduction()) {
    return {
      required: ['applicantSocialSecurityNumber', 'dateOfBirth'],
      type: 'object',
      properties: {
        applicantFullName,
        applicantSocialSecurityNumber,
        dateOfBirth,
        applicantGender,
      },
    };
  }
  return {
    type: 'object',
    properties: {
      'view:applicantInfo': {
        type: 'object',
        properties: {},
      },
    },
  };
};
