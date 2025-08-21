import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { fireEvent } from '@testing-library/react';
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
  const referralAppointmentInfo = createMockEpsAppointment(
    'appointment-id',
    'booked',
    epsAppointmentUtils.appointmentData,
  );
  const currentReferral = createReferralById(
    '2024-11-29',
    'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
  );
  const sandbox = sinon.createSandbox();

  const initialState = {
    referral: {
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

    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral currentReferral={currentReferral} />,
      {
        store: createTestStore(initialState),
        path: '/complete/UUID?confirmMsg=true',
      },
    );

    fireEvent.click(getByTestId('schedule-appointment-link'));
    expect(startNewAppointmentFlowSpy.calledOnce).to.be.true;
  });

  it('should render error alert when appointment info has an error', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral currentReferral={currentReferral} />,
      {
        store: createTestStore(errorState),
      },
    );

    expect(getByTestId('error-alert')).to.exist;
  });

  it('should render warning alert when appointment info has timed out', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral currentReferral={currentReferral} />,
      {
        store: createTestStore(timeoutErrorState),
      },
    );

    expect(getByTestId('warning-alert')).to.exist;
  });

  it('should render appointment details correctly', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <CompleteReferral currentReferral={currentReferral} />,
      {
        store: createTestStore(initialState),
      },
    );

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
});
