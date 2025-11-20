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
import * as utils from '../services/utils';

describe('VAOS ChooseDateAndTime component', () => {
  const sandbox = sinon.createSandbox();
  const referral = createReferralById('2024-09-09', 'UUID');
  const initialFullState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    appointments: {
      confirmed: [],
      confirmedStatus: FETCH_STATUS.succeeded,
    },
    appointmentApi: {
      queries: {
        'getReferralById("UUID")': {
          status: 'fulfilled',
          data: referral,
          endpoint: 'getReferralById',
          requestId: 'abc-referral',
          startedTimeStamp: 1758046349180,
          fulfilledTimeStamp: 1758046349181,
        },
        'getDraftReferralAppointment({"referralConsultId":"984_646907","referralNumber":"VA0000007241"})': {
          status: 'fulfilled',
          data: createDraftAppointmentInfo(1),
          endpoint: 'getDraftReferralAppointment',
          requestId: 'abc',
          startedTimeStamp: 1758046349181,
          fulfilledTimeStamp: 1758046349182,
        },
      },
    },
  };
  const initialEmptyState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    appointments: {
      confirmedStatus: FETCH_STATUS.notStarted,
    },
  };

  beforeEach(() => {
    sandbox
      .stub(fetchAppointmentsModule, 'fetchAppointments')
      .resolves({ data: [] });
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should fetch data from store if it exists and not call API', () => {
    const store = createTestStore(initialFullState);

    sandbox.stub(utils, 'apiRequestWithUrl').resolves({});
    renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store,
      path: '/?id=UUID',
    });
    sandbox.assert.notCalled(utils.apiRequestWithUrl);
    sandbox.assert.notCalled(fetchAppointmentsModule.fetchAppointments);
  });
  it('should show loading state while draft appointment is being fetched', () => {
    const referralForEmptyState = createReferralById('2024-09-09', 'UUID');
    const stateWithReferralOnly = {
      ...initialEmptyState,
      appointmentApi: {
        queries: {
          'getReferralById("UUID")': {
            status: 'fulfilled',
            data: referralForEmptyState,
            endpoint: 'getReferralById',
            requestId: 'abc-referral',
            startedTimeStamp: 1758046349180,
            fulfilledTimeStamp: 1758046349181,
          },
        },
        subscriptions: {
          'getReferralById("UUID")': {
            'abc-referral': { pollingInterval: 0 },
          },
        },
      },
    };

    sandbox
      .stub(utils, 'apiRequestWithUrl')
      .resolves({ data: createDraftAppointmentInfo() });
    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithReferralOnly),
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
    const stateWithAppointments = {
      ...initialFullState,
      appointmentApi: {
        queries: {
          'getReferralById("UUID")': {
            status: 'fulfilled',
            data: referralWithAppointments,
            endpoint: 'getReferralById',
            requestId: 'abc-referral',
            startedTimeStamp: 1758046349180,
            fulfilledTimeStamp: 1758046349181,
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithAppointments),
      path: '/?id=UUID',
    });

    // Should redirect and not render anything else
    expect(screen.queryByTestId('loading-container')).to.not.exist;
    expect(screen.queryByTestId('error')).to.not.exist;
  });

  it('should render DateAndTimeContent when all data loads successfully', () => {
    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(initialFullState),
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
    const stateWithDraftError = {
      ...initialFullState,
      appointmentApi: {
        queries: {
          'getReferralById("UUID")': {
            status: 'fulfilled',
            data: referral,
            endpoint: 'getReferralById',
            requestId: 'abc-referral',
            startedTimeStamp: 1758046349180,
            fulfilledTimeStamp: 1758046349181,
          },
          'getDraftReferralAppointment({"referralConsultId":"984_646907","referralNumber":"VA0000007241"})': {
            status: 'rejected',
            error: { status: 500, message: 'Failed to fetch draft' },
            endpoint: 'getDraftReferralAppointment',
            requestId: 'abc',
            startedTimeStamp: 1758046349181,
            fulfilledTimeStamp: 1758046349182,
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithDraftError),
      path: '/?id=UUID',
    });

    expect(screen.getByTestId('error')).to.exist;
  });

  it('should show error when future appointments fetch fails', () => {
    const stateWithFutureAppointmentsError = {
      ...initialFullState,
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
    const stateWithReferralError = {
      ...initialFullState,
      appointmentApi: {
        queries: {
          'getReferralById("UUID")': {
            status: 'rejected',
            error: { status: 404, message: 'Referral not found' },
            endpoint: 'getReferralById',
            requestId: 'abc-referral',
            startedTimeStamp: 1758046349180,
            fulfilledTimeStamp: 1758046349181,
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithReferralError),
      path: '/?id=UUID',
    });

    expect(screen.getByTestId('error')).to.exist;
  });

  it('should show loading when referral is loading', () => {
    const stateWithReferralLoading = {
      ...initialEmptyState,
      appointmentApi: {
        queries: {
          'getReferralById("UUID")': {
            status: 'pending',
            endpoint: 'getReferralById',
            requestId: 'abc-referral',
            startedTimeStamp: 1758046349180,
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithReferralLoading),
      path: '/?id=UUID',
    });

    expect(screen.getByTestId('loading-container')).to.exist;
    expect(screen.getByTestId('loading')).to.exist;
  });

  it('should show loading when draft succeeds but future appointments pending', () => {
    const stateWithFutureAppointmentsPending = {
      ...initialFullState,
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
      ...initialFullState,
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
    const stateWithDraftPending = {
      ...initialFullState,
      appointmentApi: {
        queries: {
          'getReferralById("UUID")': {
            status: 'fulfilled',
            data: referral,
            endpoint: 'getReferralById',
            requestId: 'abc-referral',
            startedTimeStamp: 1758046349180,
            fulfilledTimeStamp: 1758046349181,
          },
          'getDraftReferralAppointment({"referralConsultId":"984_646907","referralNumber":"VA0000007241"})': {
            status: 'pending',
            endpoint: 'getDraftReferralAppointment',
            requestId: 'abc',
            startedTimeStamp: 1758046349181,
          },
        },
      },
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
    const stateWithAppointments = {
      ...initialEmptyState,
      appointmentApi: {
        queries: {
          'getReferralById("UUID")': {
            status: 'fulfilled',
            data: referralWithAppointments,
            endpoint: 'getReferralById',
            requestId: 'abc-referral',
            startedTimeStamp: 1758046349180,
            fulfilledTimeStamp: 1758046349181,
          },
        },
      },
    };

    const apiStub = sandbox.stub(utils, 'apiRequestWithUrl').resolves({});

    renderWithStoreAndRouter(<ChooseDateAndTime />, {
      store: createTestStore(stateWithAppointments),
      path: '/?id=UUID',
    });

    // Draft query should be skipped, so draft API endpoint should not be called
    const draftCalls = apiStub
      .getCalls()
      .filter(call => call.args[0].includes('/appointments/draft'));
    expect(draftCalls.length).to.equal(0);
  });
});
