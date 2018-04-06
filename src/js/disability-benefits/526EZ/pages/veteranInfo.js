import _ from 'lodash';

import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import fullNameUI from '../../../common/schemaform/definitions/fullName';
import ssnUI from '../../../common/schemaform/definitions/ssn';
import { genderLabels } from '../../../common/utils/labels';

import { veteranInformationViewField, getVerifiedChapterPair } from '../helpers';

export default function createVeteranInfoChapter(formSchema, isReview) {

  const { fullName, date } = formSchema.definitions;

  const uiSchema = {
    veteranFullName: fullNameUI,
    socialSecurityNumber: _.assign(ssnUI, {
      'ui:title': 'Social Security number',
      'ui:required': form => !form.vaFileNumber,
    }),
    vaFileNumber: {
      'ui:title': 'VA file number',
      'ui:required': form => !form.socialSecurityNumber,
      'ui:errorMessages': {
        pattern: 'Your VA file number must be between 7 to 9 digits'
      }
    },
    dateOfBirth: currentOrPastDateUI('Date of birth'),
    gender: {
      'ui:title': 'Gender',
      'ui:options': {
        labels: genderLabels
      },
    }
  };

  const schema = {
    type: 'object',
    required: ['fullName', 'socialSecurityNumber', 'vaFileNumber', 'gender', 'dateOfBirth'],
    properties: {
      veteranFullName: fullName,
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

  const chapterConfig = {
    chapterTitle: 'Veteran Information',
    isReview,
    verifiedReviewComponent: veteranInformationViewField,
    uiSchema,
    schema
  };

  return getVerifiedChapterPair(chapterConfig);
}
