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
import { createDraftAppointmentInfo } from './utils/provider';
import { createReferralAppointment } from './utils/appointment';

describe('CompleteReferral', () => {
  const referralAppointmentInfo = createReferralAppointment(
    'appointment-id',
    'booked',
    createDraftAppointmentInfo(2),
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
      'Thursday, January 2nd, 2025',
    );
    expect(getByTestId('appointment-type')).to.have.text(
      'Physical Therapy with Dr. Bones',
    );

    expect(getByTestId('appointment-modality')).to.have.text(
      'In person at FHA South Melbourne Medical Complex',
    );
    expect(getByTestId('appointment-clinic')).to.have.text(
      'Clinic: Meridian Health (Sandbox 5vuTac8v)',
    );
  });
});
