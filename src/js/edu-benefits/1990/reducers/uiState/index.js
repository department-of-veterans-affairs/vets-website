import _ from 'lodash/fp';

import {
  UPDATE_COMPLETED_STATUS,
  UPDATE_INCOMPLETE_STATUS,
  UPDATE_EDIT_STATUS,
  UPDATE_SUBMISSION_STATUS,
  UPDATE_SUBMISSION_ID,
  UPDATE_SUBMISSION_TIMESTAMP,
  UPDATE_SUBMISSION_DETAILS,
  SET_ATTEMPTED_SUBMIT
} from '../../actions';

const ui = {
  submission: {
    status: false,
    errorMessage: false,
    id: false,
    timestamp: false,
    regionalAddress: null,
    hasAttemptedSubmit: false
  },
  pages: {
    '/introduction': {
      editOnReview: false,
      fields: []
    },
    '/benefits-eligibility/benefits-selection': {
      editOnReview: false,
      fields: ['chapter30', 'chapter32', 'chapter33', 'chapter1606', 'checkedBenefit']
    },
    '/benefits-eligibility/benefits-relinquishment': {
      editOnReview: false,
      fields: ['benefitsRelinquished', 'benefitsRelinquishedDate']
    },
    '/military-history/service-periods': {
      editOnReview: false,
      fields: ['toursOfDuty']
    },
    '/military-history/military-service': {
      editOnReview: false,
      fields: ['serviceAcademyGraduationYear', 'currentlyActiveDuty']
    },
    '/military-history/rotc-history': {
      editOnReview: false,
      fields: ['seniorRotc', 'seniorRotcScholarshipProgram', 'seniorRotcCommissioned']
    },
    '/military-history/contributions': {
      editOnReview: false,
      fields: ['civilianBenefitsAssistance', 'additionalContributions', 'activeDutyKicker', 'reserveKicker', 'activeDutyRepaying', 'activeDutyRepayingPeriod']
    },
    '/education-history/education-information': {
      editOnReview: false,
      fields: ['highSchoolOrGedCompletionDate', 'postHighSchoolTrainings']
    },
    '/employment-history/employment-information': {
      editOnReview: false,
      fields: ['hasNonMilitaryJobs', 'nonMilitaryJobs']
    },
    '/school-selection/school-information': {
      editOnReview: false,
      fields: ['educationType', 'school']
    },
    '/veteran-information': {
      editOnReview: false,
      fields: ['veteranFullName', 'veteranSocialSecurityNumber', 'veteranDateOfBirth', 'gender']
    },
    '/personal-information/contact-information': {
      editOnReview: false,
      fields: ['veteranAddress', 'email', 'emailConfirmation', 'homePhone', 'mobilePhone', 'preferredContactMethod']
    },
    '/personal-information/secondary-contact': {
      editOnReview: false,
      fields: ['secondaryContact']
    },
    '/personal-information/dependents': {
      editOnReview: false,
      fields: ['serviceBefore1977']
    },
    '/personal-information/direct-deposit': {
      editOnReview: false,
      fields: ['bankAccount']
    },
    '/review-and-submit': {
      editOnReview: false,
      fields: []
    }
  }
};

ui.pages = Object.keys(ui.pages).reduce((current, next) => {
  return _.set(`/1990${next}`, ui.pages[next], current);
}, {});

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

    case SET_ATTEMPTED_SUBMIT:
      return _.set('submission.hasAttemptedSubmit', true, state);

    default:
      return state;
  }
}

export default uiState;
