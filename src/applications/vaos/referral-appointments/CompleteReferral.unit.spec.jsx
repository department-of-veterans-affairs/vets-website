import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/react';
import * as utils from 'applications/vaos/services/utils';
import CompleteReferral from './CompleteReferral';
import * as actionsModule from './redux/actions';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { FETCH_STATUS } from '../utils/constants';
import { createMockEpsAppointment } from './utils/appointment';
import { createReferralById } from './utils/referrals';
import * as epsAppointmentUtils from './utils/appointment';

describe('CompleteReferral', () => {
  let requestStub;
  const appointmentId = 'test-appointment-id';
  const referralAppointmentInfo = createMockEpsAppointment(
    appointmentId,
    'booked',
    epsAppointmentUtils.appointmentData,
  );
  const referralDraftAppointmentInfo = createMockEpsAppointment(
    appointmentId,
    'draft',
    epsAppointmentUtils.appointmentData,
  );
  const currentReferral = createReferralById(
    '2024-11-29',
    'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
  );
  let sandbox;

  const initialState = {
    referral: {
      appointmentCreateStatus: FETCH_STATUS.succeeded,
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
  beforeEach(() => {
    sandbox = sinon.createSandbox({
      useFakeTimers: {
        now: new Date(),
        toFake: ['Date'],
      },
    });
    requestStub = sandbox.stub(utils, 'apiRequestWithUrl');
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('should call routeToCCPage when "Review your appointments" link is clicked', async () => {
    requestStub.resolves({ data: referralAppointmentInfo });
    const startNewAppointmentFlowSpy = sandbox.spy(
      actionsModule,
      'startNewAppointmentFlow',
    );

    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral currentReferral={currentReferral} />,
      {
        store: createTestStore(initialState),
        path: '/complete/UUID?confirmMsg=true',
      },
    );
    await waitFor(() => {
      expect(getByTestId('appointment-block')).to.exist;
    });
    fireEvent.click(getByTestId('schedule-appointment-link'));
    expect(startNewAppointmentFlowSpy.calledOnce).to.be.true;
  });

  it('should render error alert when appointment info has an error', async () => {
    requestStub.throws(() => new Error());
    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral currentReferral={currentReferral} />,
      {
        store: createTestStore(errorState),
      },
    );
    await sandbox.clock.tick(35000);
    await waitFor(
      () => {
        expect(getByTestId('error-alert')).to.exist;
      },
      { timeout: 3000, interval: 1000 },
    );
    expect(requestStub.calledOnce).to.be.true;
    expect(getByTestId('error-alert')).to.exist;
    expect(getByTestId('referral-community-care-office')).to.exist;
  });

  it('should render warning alert when appointment info has timed out', async () => {
    requestStub.resolves({ data: referralDraftAppointmentInfo });
    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral currentReferral={currentReferral} />,
      {
        store: createTestStore(initialState),
      },
    );
    await sandbox.clock.tick(35000);
    await waitFor(
      () => {
        expect(getByTestId('warning-alert')).to.exist;
      },
      { timeout: 3000, interval: 1000 },
    );
    expect(getByTestId('warning-alert')).to.exist;
    expect(getByTestId('referral-community-care-office')).to.exist;
  });

  it('should render appointment details correctly', async () => {
    requestStub.resolves({ data: referralAppointmentInfo });
    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral currentReferral={currentReferral} />,
      {
        store: createTestStore(initialState),
        path: `/schedule-referral/complete/${appointmentId}`,
      },
    );
    await waitFor(() => {
      expect(getByTestId('appointment-block')).to.exist;
    });
    expect(getByTestId('appointment-block')).to.exist;
    expect(getByTestId('appointment-date')).to.have.text(
      'Monday, November 18th, 2024',
    );

    // Check that appointment time container exists and contains time elements
    const timeContainer = getByTestId('appointment-time');
    expect(timeContainer).to.exist;
    expect(timeContainer.textContent).to.include('8:30');
    expect(timeContainer.textContent).to.include('a.m.');
    expect(timeContainer.textContent).to.include('ET');

    expect(getByTestId('appointment-type')).to.have.text(
      'Optometry with Dr. Moreen S. Rafa',
    );

    expect(getByTestId('survey-info-block')).to.exist;
    expect(getByTestId('survey-info-block')).to.contain.text(
      'Please consider taking our pilot feedback surveys',
    );
    expect(getByTestId('survey-link')).to.exist;
    expect(getByTestId('survey-link')).to.have.attribute(
      'text',
      'Start the sign-up survey',
    );
    expect(getByTestId('survey-link')).to.have.attribute(
      'href',
      'https://forms.gle/7Lh5H2fab7Qv3DbA9',
    );
  });

  it('should link to details view', async () => {
    requestStub.resolves({ data: referralAppointmentInfo });
    const screen = renderWithStoreAndRouter(
      <CompleteReferral currentReferral={currentReferral} />,
      {
        store: createTestStore(initialState),
        path: `/schedule-referral/complete/${appointmentId}`,
      },
    );
    await waitFor(() => {
      expect(screen.getByTestId('cc-details-link')).to.exist;
    });
    fireEvent.click(screen.getByTestId('cc-details-link'));
    await waitFor(() => {
      expect(screen.history.push.calledWith(`/${appointmentId}?eps=true`)).to.be
        .true;
    });
    expect(screen.history.push.calledWith(`/${appointmentId}?eps=true`)).to.be
      .true;
  });
});
