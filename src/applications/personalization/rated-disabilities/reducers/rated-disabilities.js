import set from 'platform/utilities/data/set';

import {
  FETCH_RATED_DISABILITIES_SUCCESS,
  FETCH_RATED_DISABILITIES_FAILED,
} from '../actions';

const initialState = {
  ratedDisabilities: null,
};

const dummyData = {
  ratedDisabilities: [
    {
      decisionCode: 'NOTSVCCON',
      decisionText: 'Not Service Connected',
      diagnosticCode: 6260,
      name: 'Tinnitus',
      effectiveDate: null,
      ratedDisabilityId: '1046370',
      ratingDecisionId: '134241',
      ratingPercentage: null,
      relatedDisabilityDate: null,
      specialIssues: 'Array[0]',
    },
    {
      decisionCode: 'SVCCONNCTED',
      decisionText: 'Service Connected',
      diagnosticCode: 5260,
      name: 'Allergies due to Hearing Loss',
      effectiveDate: '2012-05-01T05:00:00.000+00:00',
      ratedDisabilityId: '1072414',
      ratingDecisionId: '134242',
      ratingPercentage: 10,
      relatedDisabilityDate: '2018-12-22T02:12:08.000+00:00',
      specialIssues: 'Array[0]',
    },
    {
      decisionCode: 'NOTSVCCON',
      decisionText: 'Not Service Connected',
      diagnosticCode: 7913,
      name: 'Diabetes',
      effectiveDate: null,
      ratedDisabilityId: '1090859',
      ratingDecisionId: '134243',
      ratingPercentage: null,
      relatedDisabilityDate: null,
      specialIssues: 'Array[0]',
    },
    {
      decisionCode: 'SVCCONNCTED',
      decisionText: 'Service Connected',
      diagnosticCode: 6100,
      name: 'Hearing Loss',
      effectiveDate: '2005-01-01T06:00:00.000+00:00',
      ratedDisabilityId: '1128271',
      ratingDecisionId: '134244',
      ratingPercentage: 100,
      relatedDisabilityDate: null,
      specialIssues: 'Array[0]',
    },
    {
      decisionCode: 'SVCCONNCTED',
      decisionText: 'Service Connected',
      diagnosticCode: 8540,
      name: 'Sarcoma Soft-Tissue',
      effectiveDate: '2018-08-01T05:00:00.000+00:00',
      ratedDisabilityId: '1124345',
      ratingDecisionId: '134245',
      ratingPercentage: 0,
      relatedDisabilityDate: null,
      specialIssues: 'Array[1]',
    },
  ],
};

export function ratedDisabilities(state = initialState, action) {
  switch (action.type) {
    case FETCH_RATED_DISABILITIES_SUCCESS:
      return set('ratedDisabilities', dummyData, state);

    case FETCH_RATED_DISABILITIES_FAILED:
      return set('ratedDisabilities', action.response, state);

    default:
      return state;
  }
}
