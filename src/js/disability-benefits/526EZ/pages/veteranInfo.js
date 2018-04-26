import _ from 'lodash';

import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import fullNameUI from '../../../common/schemaform/definitions/fullName';
import ssnUI from '../../../common/schemaform/definitions/ssn';
import { genderLabels } from '../../../../platform/static-data/labels';
import initialData from '../tests/schema/initialData';

import VerifiedReviewContainer from '../components/VerifiedReviewContainer';
import {
  veteranInformationViewField,
  getPage,
  VAFileNumberDescription
} from '../helpers';

function createVeteranInfoPage(formSchema, isReview) {
  const { fullName, date } = formSchema.definitions;

  const uiSchema = {
    fullName: fullNameUI,
    socialSecurityNumber: _.merge({}, ssnUI, {
      'ui:title': 'Social Security number (must have this or a VA file number)',
      'ui:required': form => !form.vaFileNumber
    }),
    vaFileNumber: {
      'ui:title': 'VA file number (must have this or a Social Security number)',
      'ui:required': form => !form.socialSecurityNumber,
      'ui:help': VAFileNumberDescription,
      'ui:errorMessages': {
        pattern: 'Your VA file number must be between 7 to 9 digits'
      }
    },
    dateOfBirth: currentOrPastDateUI('Date of birth'),
    gender: {
      'ui:title': 'Gender',
      'ui:options': {
        labels: genderLabels
      }
    }
  };

  const schema = {
    type: 'object',
    required: ['fullName', 'gender', 'dateOfBirth'],
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

  const pageConfig = {
    pageTitle: 'Veteran Information',
    isReview,
    component: VerifiedReviewContainer,
    description: 'Please review the information we have on file for you. If something doesn’t look right, you can click the Edit button to fix it.',
    verifiedReviewComponent: veteranInformationViewField,
    uiSchema,
    schema,
    initialData
  };

  return getPage(pageConfig, 'Veteran Details');
}

export const createVerifiedVeteranInfoPage = formConfig =>
  createVeteranInfoPage(formConfig, true);

export const createUnverifiedVeteranInfoPage = formConfig =>
  createVeteranInfoPage(formConfig, false);
