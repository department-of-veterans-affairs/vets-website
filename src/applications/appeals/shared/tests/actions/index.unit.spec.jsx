import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as apiModule from 'platform/utilities/api';
import {
  getContestableIssues,
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../actions/index';
import { API_URLS, DEFAULT_BENEFIT_TYPE } from '../../constants';

describe('getContestableIssues', () => {
  let dispatch;
  let apiRequestStub;

  beforeEach(() => {
    dispatch = sinon.spy();
    apiRequestStub = sinon.stub();
    apiRequestStub.resolves({ data: [{ issue: 'test' }] });
    sinon.stub(apiModule, 'apiRequest').callsFake(apiRequestStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  const mockResponse = { data: [{ issue: 'test' }] };

  describe('when appAbbr is NOD (does not use benefit type)', () => {
    it('should call API without benefit type in URL', async () => {
      const props = { appAbbr: 'NOD' };
      await getContestableIssues(props)(dispatch);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: FETCH_CONTESTABLE_ISSUES_INIT,
      });

      expect(apiRequestStub.calledOnce).to.be.true;

      const calledUrl = apiRequestStub.firstCall.args[0];
      expect(calledUrl).to.include(API_URLS.NOD);

      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        response: mockResponse,
      });
    });

    it('should dispatch failed action when API request fails', async () => {
      const mockError = new Error('API Error');
      apiRequestStub.rejects(mockError);

      const props = { appAbbr: 'NOD' };
      await getContestableIssues(props)(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_INIT,
      );

      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_FAILED,
      );

      expect(dispatch.secondCall.args[0].errors).to.equal(mockError);
    });
  });

  describe('when appAbbr uses benefit type (SC or HLR)', () => {
    it('should call API with benefit type', async () => {
      const benefitType = 'compensation';
      apiRequestStub.resolves(mockResponse);

      const props = { appAbbr: 'SC', benefitType };
      await getContestableIssues(props)(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_INIT,
      );

      expect(apiRequestStub.calledOnce).to.be.true;

      const calledUrl = apiRequestStub.firstCall.args[0];
      expect(calledUrl).to.include(API_URLS.SC);
      expect(calledUrl).to.include(benefitType);

      expect(dispatch.secondCall.args[0]).to.deep.include({
        type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        response: mockResponse,
      });

      expect(dispatch.secondCall.args[0].benefitType).to.exist;
    });

    it('should dispatch failed action when benefit type is not supported', async () => {
      const props = { appAbbr: 'SC', benefitType: 'unsupported' };
      await getContestableIssues(props)(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_INIT,
      );

      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_FAILED,
      );

      expect(dispatch.secondCall.args[0].errors).to.be.an.instanceof(Error);
      expect(dispatch.secondCall.args[0].errors.message).to.equal(
        'invalidBenefitType',
      );
    });

    it('should use DEFAULT_BENEFIT_TYPE when benefitType is not provided', async () => {
      apiRequestStub.resolves(mockResponse);

      const props = { appAbbr: 'HLR' };
      await getContestableIssues(props)(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_INIT,
      );

      const calledUrl = apiRequestStub.firstCall.args[0];
      expect(calledUrl).to.include(API_URLS.HLR);
      expect(calledUrl).to.include(DEFAULT_BENEFIT_TYPE);

      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
      );
    });

    it('should dispatch failed action with benefitType when API fails for SC', async () => {
      const mockError = new Error('API Error');
      apiRequestStub.rejects(mockError);

      const props = { appAbbr: 'SC', benefitType: 'compensation' };
      await getContestableIssues(props)(dispatch);

      expect(dispatch.secondCall.args[0]).to.deep.include({
        type: FETCH_CONTESTABLE_ISSUES_FAILED,
        errors: mockError,
      });

      expect(dispatch.secondCall.args[0].benefitType).to.exist;
    });
  });
});
