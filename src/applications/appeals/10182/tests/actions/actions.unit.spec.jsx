import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';
import * as apiUtils from 'platform/utilities/api';

import { getContestableIssues } from '../../actions';
import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../../shared/actions';
import { CONTESTABLE_ISSUES_API } from '../../constants/apis';

describe('fetch contestable issues action', () => {
  const mockData = { data: 'asdf' };
  it('should dispatch an init action', () => {
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

  describe('test apiRequest', () => {
    let apiRequestSpy;
    beforeEach(() => {
      apiRequestSpy = sinon.stub(apiUtils, 'apiRequest').resolves(mockData);
    });
    afterEach(() => {
      apiRequestSpy.restore();
    });

    it('should dispatch an init action', () => {
      mockApiRequest(mockData);
      const dispatch = sinon.spy();
      return getContestableIssues()(dispatch).then(() => {
        // Original API
        expect(apiRequestSpy.args[0][0]).to.contain(CONTESTABLE_ISSUES_API);
      });
    });
  });
});
