import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../tests/mocks/setup';
import ChooseDateAndTime from './ChooseDateAndTime';
import { createReferralById } from './utils/referrals';
import { createDraftAppointmentInfo } from './utils/provider';
import * as fetchAppointmentsModule from '../services/appointment';
import { FETCH_STATUS } from '../utils/constants';
import * as vaosApi from '../redux/api/vaosApi';

describe('VAOS ChooseDateAndTime component', () => {
  const sandbox = sinon.createSandbox();
  const referral = createReferralById('2024-09-09', 'UUID');
  const draftAppointmentInfo = createDraftAppointmentInfo(1);

  const initialState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    appointments: {
      confirmed: [],
      confirmedStatus: FETCH_STATUS.succeeded,
    },
  };

  beforeEach(() => {
    sandbox
      .stub(fetchAppointmentsModule, 'fetchAppointments')
      .resolves({ data: [] });

    // Mock the referral fetch hook
    sandbox.stub(vaosApi, 'useGetReferralByIdQuery').returns({
      data: referral,
      error: null,
      isLoading: false,
    });

    // Mock the draft appointment hook
    sandbox.stub(vaosApi, 'useGetDraftReferralAppointmentQuery').returns({
      data: draftAppointmentInfo,
      isLoading: false,
      isError: false,
      isSuccess: true,
      isUninitialized: false,
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should render successfully with mocked hooks', () => {
    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store,
      path: '/?id=UUID',
    });

    // Should not show loading or error
    expect(screen.queryByTestId('loading-container')).to.not.exist;
    expect(screen.queryByTestId('error')).to.not.exist;
  });
  it('should show loading state while draft appointment is being fetched', () => {
    // Override the draft query mock to return loading state
    vaosApi.useGetDraftReferralAppointmentQuery.restore();
    sandbox.stub(vaosApi, 'useGetDraftReferralAppointmentQuery').returns({
      data: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
      isUninitialized: false,
    });

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(initialState),
      path: '/?id=UUID',
    });

    // Should show loading indicator while draft is being fetched
    expect(screen.getByTestId('loading-container')).to.exist;
    expect(screen.getByTestId('loading')).to.exist;
  });

  it('should redirect when referral has appointments', () => {
    const referralWithAppointments = {
      ...referral,
      attributes: {
        ...referral.attributes,
        hasAppointments: true,
      },
    };

    // Override the referral mock to return referral with appointments
    vaosApi.useGetReferralByIdQuery.restore();
    sandbox.stub(vaosApi, 'useGetReferralByIdQuery').returns({
      data: referralWithAppointments,
      error: null,
      isLoading: false,
    });

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(initialState),
      path: '/?id=UUID',
    });

    // Should redirect and not render anything else
    expect(screen.queryByTestId('loading-container')).to.not.exist;
    expect(screen.queryByTestId('error')).to.not.exist;
  });

  it('should render DateAndTimeContent when all data loads successfully', () => {
    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(initialState),
      path: '/?id=UUID',
    });

    // Should not show loading or error
    expect(screen.queryByTestId('loading-container')).to.not.exist;
    expect(screen.queryByTestId('error')).to.not.exist;

    // Should render the date and time content
    expect(screen.getByText(/schedule an appointment with your provider/i)).to
      .exist;
  });

  it('should show error when draft fetch fails', () => {
    // Override the draft query mock to return error state
    vaosApi.useGetDraftReferralAppointmentQuery.restore();
    sandbox.stub(vaosApi, 'useGetDraftReferralAppointmentQuery').returns({
      data: null,
      isLoading: false,
      isError: true,
      isSuccess: false,
      isUninitialized: false,
    });

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(initialState),
      path: '/?id=UUID',
    });

    expect(screen.getByTestId('error')).to.exist;
  });

  it('should show error when future appointments fetch fails', () => {
    const stateWithFutureAppointmentsError = {
      ...initialState,
      appointments: {
        confirmed: [],
        confirmedStatus: FETCH_STATUS.failed,
      },
    };

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithFutureAppointmentsError),
      path: '/?id=UUID',
    });

    expect(screen.getByTestId('error')).to.exist;
  });

  it('should show error when referral has error', () => {
    // Override the referral mock to return error state
    vaosApi.useGetReferralByIdQuery.restore();
    sandbox.stub(vaosApi, 'useGetReferralByIdQuery').returns({
      data: null,
      error: { status: 404, message: 'Referral not found' },
      isLoading: false,
    });

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(initialState),
      path: '/?id=UUID',
    });

    expect(screen.getByTestId('error')).to.exist;
  });

  it('should show loading when referral is loading', () => {
    // Override the referral mock to return loading state
    vaosApi.useGetReferralByIdQuery.restore();
    sandbox.stub(vaosApi, 'useGetReferralByIdQuery').returns({
      data: null,
      error: null,
      isLoading: true,
    });

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(initialState),
      path: '/?id=UUID',
    });

    expect(screen.getByTestId('loading-container')).to.exist;
    expect(screen.getByTestId('loading')).to.exist;
  });

  it('should show loading when draft succeeds but future appointments pending', () => {
    const stateWithFutureAppointmentsPending = {
      ...initialState,
      appointments: {
        confirmed: [],
        confirmedStatus: FETCH_STATUS.loading,
      },
    };

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithFutureAppointmentsPending),
      path: '/?id=UUID',
    });

    expect(screen.getByTestId('loading-container')).to.exist;
  });

  it('should dispatch fetchFutureAppointments when conditions are met', () => {
    const stateWithDraftSuccess = {
      ...initialState,
      appointments: {
        confirmedStatus: FETCH_STATUS.notStarted,
      },
    };

    renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithDraftSuccess),
      path: '/?id=UUID',
    });

    sandbox.assert.calledOnce(fetchAppointmentsModule.fetchAppointments);
  });

  it('should dispatch fetchFutureAppointments in parallel while draft is loading', () => {
    // Override the draft query mock to return loading state
    vaosApi.useGetDraftReferralAppointmentQuery.restore();
    sandbox.stub(vaosApi, 'useGetDraftReferralAppointmentQuery').returns({
      data: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
      isUninitialized: false,
    });

    const stateWithDraftPending = {
      ...initialState,
      appointments: {
        confirmedStatus: FETCH_STATUS.notStarted,
      },
    };

    renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithDraftPending),
      path: '/?id=UUID',
    });

    // Should dispatch future appointments even while draft is still pending
    sandbox.assert.calledOnce(fetchAppointmentsModule.fetchAppointments);
  });

  it('should skip draft query when referral has appointments', () => {
    const referralWithAppointments = {
      ...referral,
      attributes: {
        ...referral.attributes,
        hasAppointments: true,
      },
    };

    // Override the referral mock to return referral with appointments
    vaosApi.useGetReferralByIdQuery.restore();
    sandbox.stub(vaosApi, 'useGetReferralByIdQuery').returns({
      data: referralWithAppointments,
      error: null,
      isLoading: false,
    });

    // The draft query should have skip: true, so it should be uninitialized
    vaosApi.useGetDraftReferralAppointmentQuery.restore();
    const draftQueryStub = sandbox
      .stub(vaosApi, 'useGetDraftReferralAppointmentQuery')
      .returns({
        data: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        isUninitialized: true,
      });

    renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(initialState),
      path: '/?id=UUID',
    });

    // Verify that draft query was called with skip: true
    const callArgs = draftQueryStub.getCall(0).args;
    expect(callArgs[1].skip).to.be.true;
  });
});
