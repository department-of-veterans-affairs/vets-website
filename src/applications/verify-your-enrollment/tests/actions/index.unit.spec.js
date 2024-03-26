import { expect } from 'chai';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
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
  VERIFY_ENROLLMENT_FAILURE,
  UPDATE_TOGGLE_ENROLLMENT_SUCCESS,
  updateToggleEnrollmentSuccess,
  UPDATE_TOGGLE_ENROLLMENT_ERROR,
  updateToggleEnrollmentError,
  TOGGLE_ENROLLMENT_ERROR_STATEMENT,
  updateToggleEnrollmentCard,
  UPDATE_PENDING_VERIFICATIONS,
  updatePendingVerifications,
  UPDATE_VERIFICATIONS,
  updateVerifications,
  validateAddress,
  ADDRESS_VALIDATION_SUCCESS,
  ADDRESS_VALIDATION_START,
} from '../../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

const mockData = { user: 'user' };
describe('getData, creator', () => {
  let dispatch;
  let apiRequestStub;

  beforeEach(() => {
    dispatch = sinon.spy();
    apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    store.clearActions();
  });

  afterEach(() => {
    apiRequestStub.restore();
  });
  let mockDispatch;
  let clock;

  // ENROLLMENTS
  it('should disptach UPDATE_TOGGLE_ENROLLMENT_SUCCESS action', () => {
    const mockPayload = { payload: 'some payload' };
    const expectedAction = [
      { type: UPDATE_TOGGLE_ENROLLMENT_SUCCESS, payload: mockPayload },
    ];
    store.dispatch(updateToggleEnrollmentSuccess(mockPayload));

    expect(store.getActions()).to.eql(expectedAction);
  });
  it('should disptach UPDATE_TOGGLE_ENROLLMENT_ERROR action', () => {
    const mockPayload = { payload: 'some payload' };
    const expectedAction = [
      { type: UPDATE_TOGGLE_ENROLLMENT_ERROR, payload: mockPayload },
    ];
    store.dispatch(updateToggleEnrollmentError(mockPayload));

    expect(store.getActions()).to.eql(expectedAction);
  });
  it('should disptach TOGGLE_ENROLLMENT_ERROR_STATEMENT action', () => {
    const mockPayload = { payload: 'some payload' };
    const expectedAction = [
      { type: TOGGLE_ENROLLMENT_ERROR_STATEMENT, payload: mockPayload },
    ];
    store.dispatch(updateToggleEnrollmentCard(mockPayload));

    expect(store.getActions()).to.eql(expectedAction);
  });
  it('should disptach UPDATE_PENDING_VERIFICATIONS action', () => {
    const mockPayload = { payload: 'some payload' };
    const expectedAction = [
      { type: UPDATE_PENDING_VERIFICATIONS, payload: mockPayload },
    ];
    store.dispatch(updatePendingVerifications(mockPayload));

    expect(store.getActions()).to.eql(expectedAction);
  });

  it('should disptach UPDATE_VERIFICATIONS action', () => {
    const mockPayload = { payload: 'some payload' };
    const expectedAction = [
      { type: UPDATE_VERIFICATIONS, payload: mockPayload },
    ];
    store.dispatch(updateVerifications(mockPayload));

    expect(store.getActions()).to.eql(expectedAction);
  });

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
  it('dispatch VERIFY_ENROLLMENT_FAILURE after a failure api request', async () => {
    const errors = {
      status: 500,
      error: 'error',
    };
    apiRequestStub.rejects(errors);
    try {
      await verifyEnrollmentAction({
        type: VERIFY_ENROLLMENT_FAILURE,
        errors,
      })(dispatch);
    } catch (error) {
      expect(
        dispatch.calledWith({
          type: VERIFY_ENROLLMENT_FAILURE,
          errors,
        }),
      ).to.be.true;
    }
  });

  it('should dispatch ADDRESS_VALIDATION_START', async () => {
    await validateAddress({}, 'John Doe')(dispatch);
    expect(dispatch.calledWith({ type: 'ADDRESS_VALIDATION_START' })).to.be
      .true;
  });

  it('should dispatch ADDRESS_VALIDATION_SUCCESS with the validation response', async () => {
    const validationResponse = {
      addresses: [{ address: {}, addressMetaData: { confidenceScore: 100 } }],
    };
    apiRequestStub.resolves(validationResponse);
    await validateAddress({}, 'John Doe')(dispatch);
    expect(
      dispatch.calledWith({
        type: 'ADDRESS_VALIDATION_SUCCESS',
        payload: validationResponse,
      }),
    ).to.be.true;
  });

  it('should dispatch ADDRESS_VALIDATION_FAIL if the API request fails', async () => {
    const error = new Error('API request failed');
    apiRequestStub.rejects(error);
    await validateAddress({}, 'John Doe')(dispatch);
    expect(
      dispatch.calledWith({
        type: 'ADDRESS_VALIDATION_FAIL',
        payload: error.toString(),
      }),
    ).to.be.true;
  });
  it('should dispatch the correct actions on success with confidence score 100', async () => {
    const formData = {};
    const fullName = 'John Doe';

    apiRequestStub.resolves({
      addresses: [
        {
          address: {
            addressLine1: '123 Main St',
            addressLine2: 'Apt 4B',
            stateCode: 'NY',
            zipCode: '10001',
            countryCodeIso3: 'USA',
          },
          addressMetaData: {
            confidenceScore: 100,
          },
        },
      ],
    });

    await store.dispatch(validateAddress(formData, fullName));

    const actions = store.getActions();

    expect(actions[0]).to.deep.equal({ type: ADDRESS_VALIDATION_START });
    expect(actions[1]).to.deep.equal({ type: UPDATE_ADDRESS });
    expect(actions[2]).to.deep.equal({
      type: ADDRESS_VALIDATION_SUCCESS,
      payload: {
        addresses: [
          {
            address: {
              addressLine1: '123 Main St',
              addressLine2: 'Apt 4B',
              stateCode: 'NY',
              zipCode: '10001',
              countryCodeIso3: 'USA',
            },
            addressMetaData: {
              confidenceScore: 100,
            },
          },
        ],
      },
    });
  });
  it('should not call  postMailingAddress action when confidence score is less than 100', async () => {
    const formData = {};
    const fullName = 'John Doe';

    apiRequestStub.resolves({
      addresses: [
        {
          address: {
            addressLine1: '123 Main St',
            addressLine2: 'Apt 4B',
            stateCode: 'NY',
            zipCode: '10001',
            countryCodeIso3: 'USA',
          },
          addressMetaData: {
            confidenceScore: 94,
          },
        },
      ],
    });

    await store.dispatch(validateAddress(formData, fullName));

    const actions = store.getActions();

    expect(actions[0]).to.deep.equal({ type: ADDRESS_VALIDATION_START });
    expect(actions[1]).to.deep.equal({
      type: ADDRESS_VALIDATION_SUCCESS,
      payload: {
        addresses: [
          {
            address: {
              addressLine1: '123 Main St',
              addressLine2: 'Apt 4B',
              stateCode: 'NY',
              zipCode: '10001',
              countryCodeIso3: 'USA',
            },
            addressMetaData: {
              confidenceScore: 94,
            },
          },
        ],
      },
    });
  });
  it('should dispatch the correct actions on error', async () => {
    const formData = {};
    const fullName = 'John Doe';

    // Make the API request throw an error
    apiRequestStub.rejects(new Error('Network error'));

    try {
      await store.dispatch(validateAddress(formData, fullName));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).to.deep.equal({ type: 'ADDRESS_VALIDATION_START' });
      expect(actions[1]).to.deep.equal({ type: 'RESET_ADDRESS_VALIDATIONS' });
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Network error');
    }
  });

  it('should dispatch the correct actions when postMailingAddress throws an error', async () => {
    const formData = {};
    const fullName = 'John Doe';

    apiRequestStub.resolves({
      addresses: [
        {
          address: {
            addressLine1: '123 Main St',
            addressLine2: 'Apt 4B',
            stateCode: 'NY',
            zipCode: '10001',
            countryCodeIso3: 'USA',
          },
          addressMetaData: {
            confidenceScore: 100,
          },
        },
      ],
    });

    await store.dispatch(validateAddress(formData, fullName));

    const actions = store.getActions();

    expect(actions[0]).to.deep.equal({ type: ADDRESS_VALIDATION_START });
    expect(actions[1]).to.deep.equal({ type: UPDATE_ADDRESS });
    try {
      await store.dispatch(
        postMailingAddress({
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          stateCode: 'NY',
          zipCode: '10001',
          countryCodeIso3: 'USA',
        }),
      );
    } catch (error) {
      const errors = {
        status: 500,
        error: 'Failed to update address',
      };
      apiRequestStub.rejects(errors);

      expect(actions[0]).to.deep.equal({ type: 'ADDRESS_VALIDATION_START' });
      expect(actions[1]).to.deep.equal({ type: 'RESET_ADDRESS_VALIDATIONS' });
    }
  });
});
