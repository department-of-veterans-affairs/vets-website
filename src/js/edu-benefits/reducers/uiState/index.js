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
    '/introduction': {
      reviewEdit: false,
      fields: []
    },
    '/benefits-eligibility/benefits-selection': {
      reviewEdit: false,
      fields: ['chapter30', 'chapter32', 'chapter33', 'chapter1606', 'checkedBenefit']
    },
    '/benefits-eligibility/benefits-relinquishment': {
      reviewEdit: false,
      fields: ['benefitsRelinquished', 'benefitsRelinquishedDate']
    },
    '/military-history/service-periods': {
      reviewEdit: false,
      fields: ['toursOfDuty']
    },
    '/military-history/military-service': {
      reviewEdit: false,
      fields: ['serviceAcademyGraduationYear', 'currentlyActiveDuty']
    },
    '/military-history/rotc-history': {
      reviewEdit: false,
      fields: ['seniorRotc', 'seniorRotcScholarshipProgram', 'seniorRotcCommissioned']
    },
    '/military-history/contributions': {
      reviewEdit: false,
      fields: ['civilianBenefitsAssistance', 'additionalContributions', 'activeDutyKicker', 'reserveKicker', 'activeDutyRepaying', 'activeDutyRepayingPeriod']
    },
    '/education-history/education-information': {
      reviewEdit: false,
      fields: ['highSchoolOrGedCompletionDate', 'postHighSchoolTrainings']
    },
    '/employment-history/employment-information': {
      reviewEdit: false,
      fields: ['hasNonMilitaryJobs', 'nonMilitaryJobs']
    },
    '/school-selection/school-information': {
      reviewEdit: false,
      fields: ['educationType', 'school']
    },
    '/veteran-information': {
      reviewEdit: false,
      fields: ['veteranFullName', 'veteranSocialSecurityNumber', 'veteranDateOfBirth', 'gender']
    },
    '/personal-information/contact-information': {
      reviewEdit: false,
      fields: ['veteranAddress', 'email', 'emailConfirmation', 'homePhone', 'mobilePhone', 'preferredContactMethod']
    },
    '/personal-information/secondary-contact': {
      reviewEdit: false,
      fields: ['secondaryContact']
    },
    '/personal-information/dependents': {
      reviewEdit: false,
      fields: ['serviceBefore1977']
    },
    '/personal-information/direct-deposit': {
      reviewEdit: false,
      fields: ['bankAccount']
    },
    '/review-and-submit': {
      reviewEdit: false,
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
      return _.set(['pages', action.path, 'reviewEdit'], action.value, state);

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
