import { expect } from 'chai';

import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../actions';

import reducers from '../../reducers';

describe('contestableIssues reducer', () => {
  const { contestableIssues } = reducers;
  const initialState = {
    status: '',
  };

  it('should return default state', () => {
    const newState = contestableIssues(undefined, {
      type: '',
    });
    expect(newState).to.deep.equal({ status: '', error: '', issues: [] });
  });

  it('should handle FETCH_CONTESTABLE_ISSUES_INIT', () => {
    const newState = contestableIssues(initialState, {
      type: FETCH_CONTESTABLE_ISSUES_INIT,
    });
    expect(newState.status).to.equal(FETCH_CONTESTABLE_ISSUES_INIT);
  });

  it('should handle FETCH_CONTESTABLE_ISSUES_SUCCEEDED', () => {
    const newState = contestableIssues(initialState, {
      type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
    });
    expect(newState.status).to.equal(FETCH_CONTESTABLE_ISSUES_SUCCEEDED);
  });

  it('should handle FETCH_CONTESTABLE_ISSUES_FAILED', () => {
    const newState = contestableIssues(initialState, {
      type: FETCH_CONTESTABLE_ISSUES_FAILED,
    });
    expect(newState.status).to.equal(FETCH_CONTESTABLE_ISSUES_FAILED);
  });
});
