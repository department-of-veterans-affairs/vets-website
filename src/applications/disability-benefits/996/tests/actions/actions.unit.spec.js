import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers.js';

import {
  getContestableIssues,
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../actions';

const originalFetch = global.fetch;

describe('fetch contestable issues action', () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should dispatch an init action', () => {
    const mockData = { data: 'asdf' };
    const benefitType = 'compensation';
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getContestableIssues({ benefitType })(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_INIT,
      );
      expect(dispatch.secondCall.args[0]).to.eql({
        type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        response: {
          ...mockData,
        },
        benefitType,
      });
    });
  });

  it('should dispatch an add person failed action', () => {
    const mockData = { data: 'asdf' };
    const props = { benefitType: 'compensation' };
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getContestableIssues(props)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_INIT,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_FAILED,
      );
    });
  });

  it('should dispatch failed action from unsupported benefitType', () => {
    const mockData = { data: 'asdf' };
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getContestableIssues({ benefitType: 'foo' })(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_INIT,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_FAILED,
      );
    });
  });
});
