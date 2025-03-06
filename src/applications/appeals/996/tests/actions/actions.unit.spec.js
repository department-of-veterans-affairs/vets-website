import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';
import * as apiUtils from 'platform/utilities/api';

import { getContestableIssues } from '../../actions';

import { CONTESTABLE_ISSUES_API } from '../../constants/apis';

import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../../shared/actions';

describe('fetch contestable issues action', () => {
  const mockData = { data: 'asdf' };
  it('should dispatch an init action', () => {
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

  it('should dispatch failed action from unsupported benefitType', () => {
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
