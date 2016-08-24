import _ from 'lodash/fp';

import {
  UPDATE_COMPLETED_STATUS,
  UPDATE_INCOMPLETE_STATUS,
  UPDATE_REVIEW_STATUS,
  UPDATE_VERIFIED_STATUS,
  UPDATE_SUBMISSION_STATUS,
  UPDATE_SUBMISSION_ID,
  UPDATE_SUBMISSION_TIMESTAMP
} from '../../actions';

const ui = {
  submission: {
    status: false,
    errorMessage: false,
    id: false,
    timestamp: false
  },
  sections: {
    '/introduction': {
      complete: false,
      verified: false,
      fields: []
    },
    '/benefits-eligibility': {
      complete: false,
      verified: false,
      fields: []
    },
    '/military-history/service': {
      complete: false,
      verified: false,
      fields: []
    },
    '/military-history/rotc-history': {
      complete: false,
      verified: false,
      fields: []
    },
    '/military-history/benefits-history': {
      complete: false,
      verified: false,
      fields: []
    },
    '/education-history': {
      complete: false,
      verified: false,
      fields: []
    },
    '/employment-history': {
      complete: false,
      verified: false,
      fields: []
    },
    '/school-selection': {
      complete: false,
      verified: false,
      fields: []
    },
    '/veteran-information/personal-information': {
      complete: false,
      verified: false,
      fields: []
    },
    '/veteran-information/address': {
      complete: false,
      verified: false,
      fields: []
    },
    '/veteran-information/contact': {
      complete: false,
      verified: false,
      fields: []
    },
    '/veteran-information/secondary-contact': {
      complete: false,
      verified: false,
      fields: []
    },
    '/veteran-information/dependent-information': {
      complete: false,
      verified: false,
      fields: []
    },
    '/veteran-information/direct-deposit': {
      complete: false,
      verified: false,
      fields: []
    },
    '/review-and-submit': {
      complete: false,
      verified: false,
      fields: []
    }
  },
  panels: [
    {
      path: '/benefits-eligibility',
      name: 'Benefits Eligibility',
      sections: []
    },
    {
      path: '/military-history',
      name: 'Military History',
      sections: [
        { path: '/military-history/service', name: 'Military Service' },
        { path: '/military-history/rotc-history', name: 'ROTC History' },
        { path: '/military-history/benefits-history', name: 'Benefits History' }
      ]
    },
    {
      path: '/education-history',
      name: 'Education History',
      sections: []
    },
    {
      path: '/employment-history',
      name: 'Employment History',
      sections: []
    },
    {
      path: '/school-selection',
      name: 'School Selection',
      sections: []
    },
    {
      path: '/veteran-information',
      name: 'Veteran Information',
      sections: [
        { path: '/veteran-information/personal-information', name: 'Personal Information' },
        { path: '/veteran-information/address', name: 'Address' },
        { path: '/veteran-information/contact', name: 'Contact Information' },
        { path: '/veteran-information/secondary-contact', name: 'Secondary Contact' },
        { path: '/veteran-information/dependent-information', name: 'Dependent Information' },
        { path: '/veteran-information/direct-deposit', name: 'Direct Deposit' },
      ]
    },
    {
      path: '/review-and-submit',
      name: 'Review',
      sections: []
    }
  ]
};

function uiState(state = ui, action) {
  switch (action.type) {
    case UPDATE_COMPLETED_STATUS:
      return _.set(['sections', action.path, 'complete'], true, state);

    case UPDATE_INCOMPLETE_STATUS:
      return _.set(['sections', action.path, 'complete'], false, state);

    case UPDATE_REVIEW_STATUS:
      return _.set(['sections', action.path, 'complete'], action.value, state);

    case UPDATE_VERIFIED_STATUS:
      return _.set(['sections', action.path, 'verified'], action.value, state);

    case UPDATE_SUBMISSION_STATUS:
      return _.set('submission.status', action.value, state);

    case UPDATE_SUBMISSION_ID:
      return _.set('submission.id', action.value, state);

    case UPDATE_SUBMISSION_TIMESTAMP:
      return _.set('submission.timestamp', action.value, state);

    default:
      return state;
  }
}

export default uiState;
