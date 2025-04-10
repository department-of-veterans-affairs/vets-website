import { expect } from 'chai';

import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../actions';

import contestableIssuesReducer from '../../reducers/contestableIssues';

describe('contestableIssues reducer', () => {
  const initialState = {
    status: '',
  };

  it('should handle FETCH_CONTESTABLE_ISSUES_INIT', () => {
    const defaultState = { issues: [], status: '', error: '' };
    const contestableIssues = contestableIssuesReducer(data => data);
    expect(contestableIssues()).to.deep.equal(defaultState);
  });
  it('should handle FETCH_CONTESTABLE_ISSUES_INIT', () => {
    const contestableIssues = contestableIssuesReducer(data => data);
    const newState = contestableIssues(initialState, {
      type: FETCH_CONTESTABLE_ISSUES_INIT,
    });
    expect(newState.status).to.equal(FETCH_CONTESTABLE_ISSUES_INIT);
  });

  it('should handle FETCH_CONTESTABLE_ISSUES_SUCCEEDED', () => {
    const contestableIssues = contestableIssuesReducer(data => data);
    const newState = contestableIssues(initialState, {
      type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
      benefitType: 'compensation',
      response: { data: [{ test: true, test2: 'ok' }] },
    });
    expect(newState).to.deep.equal({
      status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
      issues: [{ test: true, test2: 'ok' }],
      error: '',
      legacyCount: 0,
      benefitType: 'compensation',
    });
  });

  it('should handle FETCH_CONTESTABLE_ISSUES_SUCCEEDED with custom data filter', () => {
    const getIssues = data => data.filter(issue => issue.test);
    const contestableIssues = contestableIssuesReducer(getIssues);
    const newState = contestableIssues(initialState, {
      type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
      benefitType: 'compensation',
      response: { data: [{ test: false }, { test: true, test2: 'ok' }] },
    });
    expect(newState).to.deep.equal({
      status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
      issues: [{ test: true, test2: 'ok' }],
      error: '',
      legacyCount: 0,
      benefitType: 'compensation',
    });
  });

  it('should handle FETCH_CONTESTABLE_ISSUES_FAILED', () => {
    const contestableIssues = contestableIssuesReducer(data => data);
    const newState = contestableIssues(initialState, {
      type: FETCH_CONTESTABLE_ISSUES_FAILED,
      benefitType: 'compensation',
      response: {},
      errors: 'nope',
    });
    expect(newState).to.deep.equal({
      status: FETCH_CONTESTABLE_ISSUES_FAILED,
      issues: [],
      error: 'nope',
      legacyCount: 0,
      benefitType: 'compensation',
    });
  });
});
