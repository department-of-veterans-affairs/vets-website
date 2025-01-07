import { expect } from 'chai';
import sinon from 'sinon';
import { testkit } from 'platform/testing/unit/sentry';
import * as apiUtils from 'platform/utilities/api';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import {
  getContestableIssues,
  fetchITF,
  ITF_FETCH_INITIATED,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  createITF,
  ITF_CREATION_INITIATED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from '../../actions';

import {
  NEW_API,
  CONTESTABLE_ISSUES_API,
  CONTESTABLE_ISSUES_API_NEW,
} from '../../constants/apis';

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

  describe('test new apiRequest', () => {
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
    it('should dispatch an init action with new API endpoint', () => {
      mockApiRequest(mockData);
      const dispatch = sinon.spy();
      return getContestableIssues({ [NEW_API]: true })(dispatch).then(() => {
        return getContestableIssues()(dispatch).then(() => {
          expect(apiRequestSpy.args[0][0]).to.contain(
            CONTESTABLE_ISSUES_API_NEW,
          );
        });
      });
    });
  });
});

describe('ITF actions', () => {
  const mockExtraProps = {
    accountUuid: 'abcd-1234',
    inProgressFormId: '5678',
  };
  describe('fetchITF', () => {
    before(() => {
      testkit.reset();
    });
    it('should dispatch a fetch succeeded action with data', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData);
      const dispatch = sinon.spy();
      return fetchITF(mockExtraProps)(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(ITF_FETCH_INITIATED);
        expect(dispatch.secondCall.args[0]).to.eql({
          type: ITF_FETCH_SUCCEEDED,
          data: mockData.data,
        });
      });
    });

    it('should dispatch a fetch failed action', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData, false);
      const dispatch = sinon.spy();
      return fetchITF(mockExtraProps)(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(ITF_FETCH_INITIATED);
        expect(dispatch.secondCall.args[0].type).to.equal(ITF_FETCH_FAILED);

        const sentryReports = testkit.reports();
        expect(sentryReports.length).to.be.gte(1);
        // expect(sentryReports[1].extra.accountUuid).to.equal(
        //   mockExtraProps.accountUuid,
        // );
        // expect(sentryReports[1].extra.inProgressFormId).to.equal(
        //   mockExtraProps.inProgressFormId,
        // );
      });
    });
  });

  describe('createITF', () => {
    before(() => {
      testkit.reset();
    });
    it('should dispatch a fetch succeeded action with data', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData);
      const dispatch = sinon.spy();
      return createITF(mockExtraProps)(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          ITF_CREATION_INITIATED,
        );
        expect(dispatch.secondCall.args[0]).to.eql({
          type: ITF_CREATION_SUCCEEDED,
          data: mockData.data,
        });
      });
    });

    it('should dispatch a fetch failed action', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData, false);
      const dispatch = sinon.spy();
      return createITF(mockExtraProps)(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          ITF_CREATION_INITIATED,
        );
        expect(dispatch.secondCall.args[0].type).to.eql(ITF_CREATION_FAILED);

        const sentryReports = testkit.reports();
        expect(sentryReports.length).to.be.gte(1);
        // expect(sentryReports[1].extra.accountUuid).to.equal(
        //   mockExtraProps.accountUuid,
        // );
        // expect(sentryReports[1].extra.inProgressFormId).to.equal(
        //   mockExtraProps.inProgressFormId,
        // );
      });
    });
  });
});
