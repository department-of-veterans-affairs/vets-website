import { expect } from 'chai';
import sinon from 'sinon';
import * as apiModule from '@department-of-veterans-affairs/platform-utilities/api';
import { waitFor } from '@testing-library/dom';
import {
  getData,
  GET_DATA,
  GET_DATA_SUCCESS,
  fetchPersonalInfo,
  FETCH_PERSONAL_INFO,
  FETCH_PERSONAL_INFO_FAILED,
  FETCH_PERSONAL_INFO_SUCCESS,
  updateBankInfo,
  UPDATE_BANK_INFO_SUCCESS,
  UPDATE_BANK_INFO_FAILED,
} from '../../actions';

const mockData = { user: 'user' };
describe('getData, creator', () => {
  let mockDispatch;
  let clock;

  before(() => {
    mockDispatch = sinon.spy();
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
  });
  it('should dispatch  GET_DATA, GET_DATA_SUCCESS', async () => {
    const firstAction = { type: GET_DATA };
    const seconfAction = { type: GET_DATA_SUCCESS, response: mockData };

    getData()(mockDispatch);
    expect(mockDispatch.calledWith(firstAction)).to.be.true;
    clock.tick(1000);
    await waitFor(() => {
      expect(mockDispatch.calledWith(seconfAction)).to.be.false;
    });
  });
  describe('fetchPersonalInfo', () => {
    let dispatch;
    let apiRequestStub;
    beforeEach(() => {
      dispatch = sinon.stub();
      apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    });
    afterEach(() => {
      apiRequestStub.restore();
    });
    it('should FETCH_PERSONAL_INFO and FETCH_PERSONAL_INFO_SUCCESS when api call is successful', async () => {
      const response = { data: 'test data' };
      apiRequestStub.resolves(response);
      await fetchPersonalInfo()(dispatch);
      expect(dispatch.calledWith({ type: FETCH_PERSONAL_INFO })).to.be.true;
      expect(
        dispatch.calledWith({ type: FETCH_PERSONAL_INFO_SUCCESS, response }),
      ).to.be.true;
    });
    it('should FETCH_PERSONAL_INFO and FETCH_PERSONAL_INFO_FAILED when api call is successful', async () => {
      const errors = { erros: 'some error' };
      apiRequestStub.rejects(errors);
      await fetchPersonalInfo()(dispatch);
      expect(dispatch.calledWith({ type: FETCH_PERSONAL_INFO })).to.be.true;
      expect(dispatch.calledWith({ type: FETCH_PERSONAL_INFO_FAILED, errors }))
        .to.be.true;
    });
  });
  describe('updateBankInfo', () => {
    it('dispatch UPDATE_BANK_INFO_SUCCESS after a sucessful api request', async () => {
      const apiRequestStub2 = sinon.stub(apiModule, 'apiRequest');
      const dispatch = sinon.stub();
      const response = { data: 'test data' };
      apiRequestStub2.resolves(response);
      await updateBankInfo()(dispatch);
      expect(
        dispatch.calledWith({
          type: UPDATE_BANK_INFO_SUCCESS,
          response,
        }),
      ).to.be.true;
      apiRequestStub2.restore();
    });
    it('dispatch UPDATE_BANK_INFO_FAILED after a sucessful api request', async () => {
      const apiRequestStub2 = sinon.stub(apiModule, 'apiRequest');
      const dispatch = sinon.stub();
      const errors = { erros: 'some error' };
      apiRequestStub2.rejects(errors);
      await updateBankInfo()(dispatch);
      expect(
        dispatch.calledWith({
          type: UPDATE_BANK_INFO_FAILED,
          errors,
        }),
      ).to.be.true;
      apiRequestStub2.restore();
    });
  });
});
