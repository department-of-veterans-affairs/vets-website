import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { fireEvent } from '@testing-library/react';
import CompleteReferral from './CompleteReferral';
<<<<<<< HEAD
import * as flow from './flow';

=======

import * as actionsModule from './redux/actions';
>>>>>>> main
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
<<<<<<< HEAD
import { createReferralById, getReferralSlotKey } from './utils/referrals';
import { FETCH_STATUS } from '../utils/constants';
import { createProviderDetails } from './utils/provider';
import * as getProviderByIdModule from '../services/referral';

describe('CompleteReferral', () => {
  const providerDetails = createProviderDetails(1, '111');
  providerDetails.slots[0].start = '2024-11-29T16:00:00.000Z';
  providerDetails.slots[0].end = '2024-11-29T17:00:00.000Z';
=======
import { FETCH_STATUS } from '../utils/constants';
import { createMockEpsAppointment } from './utils/appointment';
import * as epsAppointmentUtils from './utils/appointment';

describe('CompleteReferral', () => {
  const referralAppointmentInfo = createMockEpsAppointment(
    'appointment-id',
    'booked',
    epsAppointmentUtils.appointmentData,
  );
>>>>>>> main
  const sandbox = sinon.createSandbox();

  const initialState = {
    referral: {
<<<<<<< HEAD
      selectedProvider: providerDetails,
      providerFetchStatus: FETCH_STATUS.succeeded,
      selectedSlot: '0',
      currentPage: 'complete',
    },
  };

  beforeEach(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
    sandbox
      .stub(getProviderByIdModule, 'getProviderById')
      .resolves(providerDetails);
    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.setItem(selectedSlotKey, 0);
  });
  afterEach(() => {
    sandbox.restore();
    sessionStorage.clear();
    global.XMLHttpRequest.restore();
  });

  describe('when confirmMsg is true', () => {
    it('should render review and schedule links', () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <CompleteReferral
          currentReferral={createReferralById('2024-11-29', 'UUID', '111')}
        />,
        {
          store: createTestStore(initialState),
          path: '/complete/UUID?confirmMsg=true',
        },
      );

      expect(getByTestId('review-appointments-link')).to.exist;
    });
    it('should call routeToCCPage when "Review your appointments" link is clicked', () => {
      const routeToCCPage = sandbox.stub(flow, 'routeToCCPage');

      const { getByTestId } = renderWithStoreAndRouter(
        <CompleteReferral
          currentReferral={createReferralById('2024-11-29', 'UUID', '111')}
        />,
        {
          store: createTestStore(initialState),
          path: '/complete/UUID?confirmMsg=true',
        },
      );

      fireEvent.click(getByTestId('review-appointments-link'));
      expect(routeToCCPage.calledOnce).to.be.true;
    });
  });

  it('should render error alert when provider loading fails', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral
        currentReferral={createReferralById('2024-11-29', 'UUID', '111')}
      />,
      {
        store: createTestStore({
          ...initialState,
          referral: {
            ...initialState.referral,
            selectedProvider: {},
            providerFetchStatus: FETCH_STATUS.failed,
          },
        }),
      },
    );

    expect(getByTestId('error-alert')).to.exist;
  });

  it('should redirect to home if no saved slot key or provider', () => {
    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.removeItem(selectedSlotKey);

    const { history } = renderWithStoreAndRouter(
      <CompleteReferral
        currentReferral={createReferralById('2024-11-29', 'UUID', '111')}
      />,
      {
        store: createTestStore(initialState),
        path: '/complete/UUID',
      },
    );

    sandbox.assert.notCalled(getProviderByIdModule.getProviderById);
    expect(history.location.pathname).to.equal('/');
  });

  it('should render appointment details correctly when provider and slot are available', () => {
    providerDetails.slots[0].start = '2024-11-29T16:00:00.000Z';
    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral
        currentReferral={createReferralById('2024-11-29', 'UUID', '111')}
      />,
      {
        store: createTestStore({
          ...initialState,
          referral: {
            ...initialState.referral,
            selectedProvider: providerDetails,
          },
        }),
      },
    );

    expect(getByTestId('referral-content')).to.exist;
    expect(getByTestId('contact-va-for-questions')).to.exist;
    expect(getByTestId('add-to-calendar-button')).to.exist;
    expect(getByTestId('appointment-date-time')).to.have.text(
      'Friday, November 29, 202411:00 a.m. ET',
    );
    expect(getByTestId('provider-name')).to.exist;
    expect(getByTestId('provider-org-name')).to.exist;
    expect(getByTestId('provider-address')).to.have.text(
      '111 Lori Ln.New York, New York 10016',
    );
    expect(getByTestId('provider-facility-org-name')).to.exist;
    expect(getByTestId('changes-copy')).to.exist;
    expect(getByTestId('referring-facility-telephone')).to.exist;
    expect(getByTestId('referring-facility-telephone-tty')).to.exist;
    expect(getByTestId('print-button')).to.exist;
  });

  it('should redirect to appointments if no slot selected', async () => {
    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.removeItem(selectedSlotKey);

    const noSelectState = {
      ...initialState,
      ...{ referral: { ...initialState.referral, selectedSlot: '' } },
    };
    const { history } = renderWithStoreAndRouter(
      <CompleteReferral
        currentReferral={createReferralById('2024-11-29', 'UUID')}
      />,
      {
        store: createTestStore(noSelectState),
        path: '/complete/UUID',
      },
    );
    sandbox.assert.notCalled(getProviderByIdModule.getProviderById);
    expect(history.location.pathname).to.equal('/');
=======
      appointmentCreateStatus: FETCH_STATUS.succeeded,
      appointmentInfoError: false,
      appointmentInfoTimeout: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo,
    },
  };

  const errorState = {
    referral: {
      appointmentCreateStatus: FETCH_STATUS.succeeded,
      appointmentInfoError: true,
      appointmentInfoTimeout: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo: {},
    },
  };

  const timeoutErrorState = {
    referral: {
      appointmentCreateStatus: FETCH_STATUS.succeeded,
      appointmentInfoError: false,
      appointmentInfoTimeout: true,
      appointmentInfoLoading: false,
      referralAppointmentInfo: {},
    },
  };

  afterEach(() => {
    sandbox.restore();
  });

  it('should call routeToCCPage when "Review your appointments" link is clicked', () => {
    const startNewAppointmentFlowSpy = sandbox.spy(
      actionsModule,
      'startNewAppointmentFlow',
    );

    const { getByTestId } = renderWithStoreAndRouter(<CompleteReferral />, {
      store: createTestStore(initialState),
      path: '/complete/UUID?confirmMsg=true',
    });

    fireEvent.click(getByTestId('schedule-appointment-link'));
    expect(startNewAppointmentFlowSpy.calledOnce).to.be.true;
  });

  it('should render error alert when appointment info has an error', () => {
    const { getByTestId } = renderWithStoreAndRouter(<CompleteReferral />, {
      store: createTestStore(errorState),
    });

    expect(getByTestId('error-alert')).to.exist;
  });

  it('should render warning alert when appointment info has timed out', () => {
    const { getByTestId } = renderWithStoreAndRouter(<CompleteReferral />, {
      store: createTestStore(timeoutErrorState),
    });

    expect(getByTestId('warning-alert')).to.exist;
  });

  it('should render appointment details correctly', () => {
    const { getByTestId } = renderWithStoreAndRouter(<CompleteReferral />, {
      store: createTestStore(initialState),
    });

    expect(getByTestId('appointment-block')).to.exist;
    expect(getByTestId('appointment-date')).to.have.text(
      'Thursday, November 21st, 2024',
    );
    expect(getByTestId('appointment-type')).to.have.text(
      'Physical Therapy with Dr. Bones',
    );

    expect(getByTestId('appointment-modality')).to.have.text(
      'In Person at Test Medical Complex',
    );
    expect(getByTestId('appointment-clinic')).to.have.text(
      'Clinic: Meridian Health',
    );
>>>>>>> main
  });
});
