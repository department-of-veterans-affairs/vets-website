import _ from 'lodash/fp';

import {
  UPDATE_COMPLETED_STATUS,
  UPDATE_INCOMPLETE_STATUS,
  UPDATE_EDIT_STATUS,
  UPDATE_SUBMISSION_STATUS,
  UPDATE_SUBMISSION_ID,
  UPDATE_SUBMISSION_TIMESTAMP,
  UPDATE_SUBMISSION_DETAILS
} from '../../actions';

const ui = {
  submission: {
    status: false,
    errorMessage: false,
    id: false,
    timestamp: false,
    regionalAddress: null
  },
  pages: {
    '/1990/introduction': {
      editOnReview: false,
      fields: []
    },
    '/1990/benefits-eligibility/benefits-selection': {
      editOnReview: false,
      fields: ['chapter30', 'chapter32', 'chapter33', 'chapter1606', 'checkedBenefit']
    },
    '/1990/benefits-eligibility/benefits-relinquishment': {
      editOnReview: false,
      fields: ['benefitsRelinquished', 'benefitsRelinquishedDate']
    },
    '/1990/military-history/service-periods': {
      editOnReview: false,
      fields: ['toursOfDuty']
    },
    '/1990/military-history/military-service': {
      editOnReview: false,
      fields: ['serviceAcademyGraduationYear', 'currentlyActiveDuty']
    },
    '/1990/military-history/rotc-history': {
      editOnReview: false,
      fields: ['seniorRotc', 'seniorRotcScholarshipProgram', 'seniorRotcCommissioned']
    },
    '/1990/military-history/contributions': {
      editOnReview: false,
      fields: ['civilianBenefitsAssistance', 'additionalContributions', 'activeDutyKicker', 'reserveKicker', 'activeDutyRepaying', 'activeDutyRepayingPeriod']
    },
    '/1990/education-history/education-information': {
      editOnReview: false,
      fields: ['highSchoolOrGedCompletionDate', 'postHighSchoolTrainings']
    },
    '/1990/employment-history/employment-information': {
      editOnReview: false,
      fields: ['hasNonMilitaryJobs', 'nonMilitaryJobs']
    },
    '/1990/school-selection/school-information': {
      editOnReview: false,
      fields: ['educationType', 'school']
    },
    '/1990/veteran-information': {
      editOnReview: false,
      fields: ['veteranFullName', 'veteranSocialSecurityNumber', 'veteranDateOfBirth', 'gender']
    },
    '/1990/personal-information/contact-information': {
      editOnReview: false,
      fields: ['veteranAddress', 'email', 'emailConfirmation', 'homePhone', 'mobilePhone', 'preferredContactMethod']
    },
    '/1990/personal-information/secondary-contact': {
      editOnReview: false,
      fields: ['secondaryContact']
    },
    '/1990/personal-information/dependents': {
      editOnReview: false,
      fields: ['serviceBefore1977']
    },
    '/1990/personal-information/direct-deposit': {
      editOnReview: false,
      fields: ['bankAccount']
    },
    '/1990/review-and-submit': {
      editOnReview: false,
      fields: []
    }
  }
};

function uiState(state = ui, action) {
  switch (action.type) {
    case UPDATE_COMPLETED_STATUS:
      return _.set(['pages', action.path, 'complete'], true, state);

    case UPDATE_INCOMPLETE_STATUS:
      return _.set(['pages', action.path, 'complete'], false, state);

    case UPDATE_EDIT_STATUS:
      return _.set(['pages', action.path, 'editOnReview'], action.value, state);

    case UPDATE_SUBMISSION_STATUS:
      return _.set('submission.status', action.value, state);

    case UPDATE_SUBMISSION_ID:
      return _.set('submission.id', action.value, state);

    case UPDATE_SUBMISSION_TIMESTAMP:
      return _.set('submission.timestamp', action.value, state);

    case UPDATE_SUBMISSION_DETAILS: {
      const submission = _.merge(state.submission, {
        id: action.attributes.confirmationNumber,
        regionalAddress: action.attributes.regionalOffice,
        timestamp: action.attributes.submittedAt,
        status: 'applicationSubmitted'
      });

      return _.set('submission', submission, state);
    }
    default:
      return state;
  }
}

export default uiState;
