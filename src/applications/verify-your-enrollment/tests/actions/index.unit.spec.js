import { expect } from 'chai';
import * as apiModule from '@department-of-veterans-affairs/platform-utilities/api';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import {
  getData,
  GET_DATA,
  GET_DATA_SUCCESS,
  FETCH_PERSONAL_INFO,
  FETCH_PERSONAL_INFO_SUCCESS,
  FETCH_PERSONAL_INFO_FAILED,
  fetchPersonalInfo,
} from '../../actions';

const mockData = { user: 'user' };
describe('actions', () => {
  describe('getData creator', () => {
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
});
