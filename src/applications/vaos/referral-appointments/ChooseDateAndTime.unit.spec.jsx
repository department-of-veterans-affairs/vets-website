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
import confirmedV2 from '../services/mocks/v2/confirmed.json';
import * as postDraftReferralAppointmentModule from '../services/referral';
import * as fetchAppointmentsModule from '../services/appointment';
import * as flow from './flow';
import { FETCH_STATUS } from '../utils/constants';

describe('VAOS ChoseDateAndTime component', () => {
  const sandbox = sinon.createSandbox();
  const confirmed = [
    {
      minutesDuration: 30,
      version: 2,
      description: 'VAOS_UNKNOWN',
      id: '00C893va',
      resourceType: 'Appointment',
      start: '2023-12-21T09:00:00-08:00',
      status: 'cancelled',
      location: {
        clinicId: '437',
        stationId: '983',
        vistaId: '983',
        clinicName: null,
        clinicPhone: null,
        clinicPhoneExtension: null,
        clinicPhysicalLocation: null,
      },
      practitioners: [],
      vaos: {
        appointmentType: 'vaAppointment',
        apiData: {
          minutesDuration: 30,
          priority: 0,
          clinic: '437',
          comment: 'Follow-up/Routine: I have a headache',
          description: 'Upcoming COVID-19 appointment',
          end: '2023-12-21T18:19:34',
          id: '00C893va',
          kind: 'clinic',
          localStartTime: '2023-12-21T09:00:00.000-06:00',
          locationId: '983',
          serviceType: 'covid',
          start: '2023-12-21T18:19:34',
          status: 'cancelled',
          contact: {
            telecom: [
              {
                type: 'email',
                value: null,
              },
            ],
          },
          practitioners: [],
          preferredTimesForPhoneCall: [],
          reasonCode: {
            text: 'Follow-up/Routine: Covid shot',
          },
          cancelationReason: null,
          cancellable: false,
          patientIcn: null,
          requestedPeriods: null,
          slot: null,
          telehealth: null,
        },
        isCancellable: false,
        isCommunityCare: false,
        isCompAndPenAppointment: false,
        isCOVIDVaccine: true,
        isExpressCare: false,
        isPastAppointment: true,
        isPendingAppointment: false,
        isPhoneAppointment: false,
        isUpcomingAppointment: false,
        isVideo: false,
      },
      videoData: {
        isVideo: false,
      },
      cancelationReason: null,
      communityCareProvider: null,
      preferredProviderName: null,
    },
  ];
  const initialFullState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      draftAppointmentInfo: createDraftAppointmentInfo(1),
      draftAppointmentCreateStatus: FETCH_STATUS.succeeded,
    },
    appointments: {
      confirmed,
      confirmedStatus: FETCH_STATUS.succeeded,
    },
  };
  const initialEmptyState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      draftAppointmentInfo: {},
      draftAppointmentCreateStatus: FETCH_STATUS.notStarted,
    },
    appointments: {
      confirmed: [],
      confirmedStatus: FETCH_STATUS.notStarted,
    },
  };
  const failedState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      draftAppointmentInfo: {},
      draftAppointmentCreateStatus: FETCH_STATUS.failed,
    },
    appointments: {
      confirmed,
      confirmedStatus: FETCH_STATUS.succeeded,
    },
  };
  beforeEach(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
    sandbox
      .stub(postDraftReferralAppointmentModule, 'postDraftReferralAppointment')
      .resolves({ data: createDraftAppointmentInfo(1) });
    sandbox
      .stub(fetchAppointmentsModule, 'fetchAppointments')
      .resolves(confirmedV2);
    sandbox
      .stub(flow, 'getReferralUrlLabel')
      .returns('Schedule an appointment with your provider');
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should fetch provider or appointments from store if it exists and not call API', async () => {
    renderWithStoreAndRouter(
      <ChooseDateAndTime
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialFullState),
      },
    );
    sandbox.assert.notCalled(
      postDraftReferralAppointmentModule.postDraftReferralAppointment,
    );
    sandbox.assert.notCalled(fetchAppointmentsModule.fetchAppointments);
  });
  it('should call API for provider or appointment data if not in store', async () => {
    const screen = renderWithStoreAndRouter(
      <ChooseDateAndTime
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialEmptyState),
      },
    );
    expect(await screen.getByTestId('loading')).to.exist;
    sandbox.assert.calledOnce(
      postDraftReferralAppointmentModule.postDraftReferralAppointment,
    );
    sandbox.assert.calledOnce(fetchAppointmentsModule.fetchAppointments);
  });
  it('should show error if any fetch fails', async () => {
    const screen = renderWithStoreAndRouter(
      <ChooseDateAndTime
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(failedState),
      },
    );
    expect(await screen.getByTestId('error')).to.exist;
  });
});
