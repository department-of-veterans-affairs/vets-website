import { expect } from 'chai';
import sinon from 'sinon';

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
  });
});

describe('ITF actions', () => {
  const mockExtraProps = {
    accountUuid: 'abcd-1234',
    inProgressFormId: '5678',
  };
  describe('fetchITF', () => {
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
      global.window.DD_LOGS = { logger: { error: sinon.spy() } };
      const dispatch = sinon.spy();
      return fetchITF(mockExtraProps)(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(ITF_FETCH_INITIATED);
        expect(dispatch.secondCall.args[0].type).to.equal(ITF_FETCH_FAILED);

        const loggerSpy = global.window.DD_LOGS.logger.error;
        expect(loggerSpy.called).to.be.true;
        expect(loggerSpy.args[0][0]).to.equal('SC ITF fetch failed');
        expect(loggerSpy.args[0][1].name).to.equal('sc_itf_fetch_failed');
        expect(loggerSpy.args[0][1].accountUuid).to.equal(
          mockExtraProps.accountUuid,
        );
        expect(loggerSpy.args[0][1].inProgressFormId).to.equal(
          mockExtraProps.inProgressFormId,
        );
        delete global.window.DD_LOGS;
      });
    });
  });

  describe('createITF', () => {
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
      global.window.DD_LOGS = { logger: { error: sinon.spy() } };
      const dispatch = sinon.spy();
      return createITF(mockExtraProps)(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          ITF_CREATION_INITIATED,
        );
        expect(dispatch.secondCall.args[0].type).to.eql(ITF_CREATION_FAILED);

        const loggerSpy = global.window.DD_LOGS.logger.error;
        expect(loggerSpy.called).to.be.true;
        expect(loggerSpy.args[0][0]).to.equal('SC ITF creation failed');
        expect(loggerSpy.args[0][1].name).to.equal('sc_itf_creation_failed');
        expect(loggerSpy.args[0][1].accountUuid).to.equal(
          mockExtraProps.accountUuid,
        );
        expect(loggerSpy.args[0][1].inProgressFormId).to.equal(
          mockExtraProps.inProgressFormId,
        );
        delete global.window.DD_LOGS;
      });
    });
  });
});
