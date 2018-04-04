import React from 'react';
import _ from 'lodash';

import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import fullNameUI from '../../../common/schemaform/definitions/fullName';
import ssnUI from '../../../common/schemaform/definitions/ssn';
import { genderLabels } from '../../../common/utils/labels';
import VerifiedReviewPage from '../components/VerifiedReviewPage';

export default function createVeteranInfoChapter(formSchema, isReview) {

  const { fullName, date } = formSchema.definitions;

  const uiSchema = {
    fullName: _.merge(fullNameUI, {
      'ui:options': {
        summaryViewField: ({ formData }) => {
          const { first, middle, last, suffix } = formData;
          return <strong>{first} {middle} {last} {suffix}</strong>;
        }
      }
    }),
    socialSecurityNumber: _.assign(ssnUI, {
      'ui:title': 'Social Security number (must have this or a VA file number)',
      'ui:required': form => !form.veteranVaFileNumber,
      'ui:options': {
        viewField: ({ formData }) => {
          const ssn = formData.slice(5);
          const mask = <span>•••-••-</span>;
          return <p>Social Security number: {mask}{ssn}</p>;
        }
      }
    }),
    vaFileNumber: {
      'ui:title': 'VA file number (must have this or a Social Security number)',
      'ui:required': form => !form.veteranSocialSecurityNumber,
      'ui:errorMessages': {
        pattern: 'Your VA file number must be between 7 to 9 digits'
      },
      'ui:options': {
        viewField: ({ formData }) => {
          const vaFileNumber = formData.slice(5);
          const mask = <span>•••-••-</span>;
          return <p>VA file number: {mask}{vaFileNumber}</p>;
        }
      }
    },
    dateOfBirth: _.merge(currentOrPastDateUI('Date of birth'), {
      'ui:options': {
        viewField: ({ formData }) => {
          const dateOfBirth = formData.split('-');
          dateOfBirth.push(dateOfBirth.shift());
          return <p>Date of birth: {dateOfBirth.join('/')}</p>;
        }
      }
    }),
    gender: {
      'ui:title': 'Gender',
      'ui:options': {
        labels: genderLabels,
        viewField: ({ formData }) => <p>Gender: {genderLabels[formData]}</p>
      },
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
        pattern: '^[cC]{0,1}\\d{7,9}$'
      },
      gender: {
        type: 'string',
        'enum': ['F', 'M']
      },
      dateOfBirth: date
    }
  };
  const reviewString = isReview ? 'Review ' : '';
  const pageName = isReview ? 'reviewVeteranInformation' : 'veteranInformation';
  const pageDescription = isReview ? 'Please review the information we have on file for you. If something doesn’t look right, you can fix it by clicking the Edit button.' : undefined;
  const pagePath = isReview ? 'review-veteran-information' : 'veteran-information';
  const pageComponent = isReview ? VerifiedReviewPage : undefined;
  const chapter = {
    title: `${reviewString}Veteran Information`,
    reviewTitle: 'Veteran Information',
    pages: {
      [pageName]: {
        title: `${reviewString}Veteran Information`,
        description: pageDescription,
        path: pagePath,
        component: pageComponent,
        depends: true,
        uiSchema,
        schema
      }
    }
  };

  return chapter;
}
