import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import { getContestableIssues } from '../../actions';
import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../../shared/actions';

describe('fetch contestable issues action', () => {
  it('should dispatch an init action', () => {
    const mockData = { data: 'asdf' };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getContestableIssues()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_INIT,
      );
      expect(dispatch.secondCall.args[0]).to.eql({
        type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        response: {
          ...mockData,
        },
      });
    });
  });

  it('should dispatch a failed action', () => {
    const mockData = { data: 'asdf' };
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getContestableIssues()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_INIT,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_FAILED,
      );
    });
  });
});
