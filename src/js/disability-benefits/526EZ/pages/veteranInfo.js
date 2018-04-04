import React from 'react';
import _ from 'lodash';

import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import fullNameUI from '../../../common/schemaform/definitions/fullName';
import ssnUI from '../../../common/schemaform/definitions/ssn';

import VerifiedReviewPage from '../components/VerifiedReviewPage';

export default function createVeteranInfoChapter(formSchema) {

  const { fullName, date } = formSchema.definitions;

  const uiSchema = {
    fullName: fullNameUI,
    socialSecurityNumber: _.assign(ssnUI, {
      'ui:title': 'Social Security number (must have this or a VA file number)',
      'ui:required': form => !form.veteranVaFileNumber,
    }),
    vaFileNumber: {
      'ui:title': 'VA file number (must have this or a Social Security number)',
      'ui:required': form => !form.veteranSocialSecurityNumber,
      'ui:errorMessages': {
        pattern: 'Your VA file number must be between 7 to 9 digits'
      }
    },
    dateOfBirth: currentOrPastDateUI('Date of birth'),
    gender: {
      'ui:title': 'Gender',
      'ui:options': {
        labels: {
          female: 'Female',
          male: 'Male'
        }
      }
    }
  };

  const schema = {
    type: 'object',
    required: ['fullName', 'socialSecurityNumber', 'vaFileNumber', 'gender', 'dateOfBirth'],
    properties: {
      fullName,
      socialSecurityNumber: {
        type: 'string'
      },
      vaFileNumber: {
        type: 'string',
        pattern: "^[cC]{0,1}\\d{7,9}$"
      },
      gender: {
        type: 'string',
        'enum': ['male', 'female']
      },
      dateOfBirth: date
    }
  };

  const chapter = {
    title: 'Veteran Information',
    pages: {
      reviewVeteranInformation: {
        title: 'Review Veteran Information',
        path: 'review-veteran-information',
        component: VerifiedReviewPage,
        depends: (formData) => formData.verifiedITF,
        uiSchema,
        schema
      },
      veteranInformation: {
        title: 'Veteran Information',
        path: 'veteran-information',
        depends: (formData) => !formData.verifiedITF,
        uiSchema,
        schema
      }
    }
  };

  return chapter;
}
