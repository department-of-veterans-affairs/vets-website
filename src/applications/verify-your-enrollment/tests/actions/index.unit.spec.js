import { expect } from 'chai';
import sinon from 'sinon';
import * as apiModule from '@department-of-veterans-affairs/platform-utilities/api';
import { waitFor } from '@testing-library/react';
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
  UPDATE_ADDRESS,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
  postMailingAddress,
  VERIFY_ENROLLMENT_SUCCESS,
  verifyEnrollmentAction,
} from '../../actions';

const mockData = { user: 'user' };
describe('getData, creator', () => {
  let dispatch;
  let apiRequestStub;

  beforeEach(() => {
    dispatch = sinon.spy();
    apiRequestStub = sinon.stub(apiModule, 'apiRequest');
  });

  afterEach(() => {
    apiRequestStub.restore();
  });
  let mockDispatch;
  let clock;

  it('should dispatch  GET_DATA, GET_DATA_SUCCESS', async () => {
    mockDispatch = sinon.spy();
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
    const firstAction = { type: GET_DATA };
    const seconfAction = { type: GET_DATA_SUCCESS, response: mockData };

    getData()(mockDispatch);
    expect(mockDispatch.calledWith(firstAction)).to.be.true;
    clock.tick(1000);
    await waitFor(() => {
      expect(mockDispatch.calledWith(seconfAction)).to.be.false;
    });
  });
  it('should FETCH_PERSONAL_INFO and FETCH_PERSONAL_INFO_SUCCESS when api call is successful', async () => {
    const response = { data: 'test data' };
    apiRequestStub.resolves(response);
    await fetchPersonalInfo()(dispatch);
    expect(dispatch.calledWith({ type: FETCH_PERSONAL_INFO })).to.be.true;
    await waitFor(() => {
      expect(
        dispatch.calledWith({ type: FETCH_PERSONAL_INFO_SUCCESS, response }),
      ).to.be.true;
    });
  });
  it('should FETCH_PERSONAL_INFO and FETCH_PERSONAL_INFO_FAILED when api call is successful', async () => {
    const errors = { erros: 'some error' };
    apiRequestStub.rejects(errors);
    await fetchPersonalInfo()(dispatch);
    expect(dispatch.calledWith({ type: FETCH_PERSONAL_INFO })).to.be.true;
    expect(dispatch.calledWith({ type: FETCH_PERSONAL_INFO_FAILED, errors })).to
      .be.true;
  });
  it('dispatch UPDATE_BANK_INFO_SUCCESS after a sucessful api request', async () => {
    const response = { status: 204, data: 'test data', ok: true };
    apiRequestStub.resolves(response);
    await updateBankInfo({ data: 'test data' })(dispatch);
    expect(
      dispatch.calledWith({
        type: UPDATE_BANK_INFO_SUCCESS,
        response,
      }),
    ).to.be.true;
  });
  it('dispatch UPDATE_BANK_INFO_FAILED after a sucessful api request', async () => {
    const errors = { erros: 'some error' };
    apiRequestStub.rejects(errors);
    try {
      await updateBankInfo()(dispatch);
    } catch (error) {
      expect(
        dispatch.calledWith({
          type: UPDATE_BANK_INFO_FAILED,
          errors,
        }),
      ).to.be.true;
    }
    apiRequestStub.restore();
  });

  it('dispatches UPDATE_ADDRESS action immediately', async () => {
    const mailingAddress = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };

    await waitFor(() => {
      postMailingAddress(mailingAddress)(dispatch);
    });

    expect(dispatch.calledWith({ type: UPDATE_ADDRESS })).to.be.true;
  });

  it('dispatches UPDATE_ADDRESS_SUCCESS action when API request succeeds', async () => {
    const mailingAddress = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };
    const response = { status: 204, data: mailingAddress, ok: true };
    apiRequestStub.resolves(response);

    await postMailingAddress(mailingAddress)(dispatch);

    expect(dispatch.calledWith({ type: UPDATE_ADDRESS_SUCCESS, response })).to
      .be.true;
  });

  it('dispatches UPDATE_ADDRESS_FAILURE action when API request fails', async () => {
    const mailingAddress = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };
    const errors = {
      status: 500,
      error: 'Failed to update address',
    };
    apiRequestStub.rejects(errors);
    try {
      await postMailingAddress(mailingAddress)(dispatch);
    } catch (error) {
      expect(dispatch.calledWith({ type: UPDATE_ADDRESS_FAILURE, errors })).to
        .be.true;
    }
  });
  it('dispatch VERIFY_ENROLLMENT_SUCCESS after a sucessful api request', async () => {
    const response = {
      status: 204,
      data: 'verify enrollment',
      ok: true,
    };
    apiRequestStub.resolves(response);
    await verifyEnrollmentAction({ data: 'verify enrollment' })(dispatch);
    expect(
      dispatch.calledWith({
        type: VERIFY_ENROLLMENT_SUCCESS,
        response,
      }),
    ).to.be.true;
  });
});
