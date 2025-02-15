import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { fireEvent } from '@testing-library/react';
import CompleteReferral from './CompleteReferral';
import * as flow from './flow';

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
  referralAppointmentInfo.slots.slots[0].start = '2024-11-29T16:00:00.000Z';
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
    const routeToCCPage = sandbox.spy(flow, 'routeToCCPage');

    const { getByTestId } = renderWithStoreAndRouter(<CompleteReferral />, {
      store: createTestStore(initialState),
      path: '/complete/UUID?confirmMsg=true',
    });

    fireEvent.click(getByTestId('review-appointments-link'));
    expect(routeToCCPage.calledOnce).to.be.true;
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

    expect(getByTestId('referral-content')).to.exist;
    expect(getByTestId('appointment-date-time')).to.have.text(
      'Friday, November 29, 2024',
    );
    expect(getByTestId('provider-name')).to.exist;
    expect(getByTestId('provider-org-name')).to.exist;
    expect(getByTestId('provider-address')).to.have.text(
      '1105 Palmetto Ave, Melbourne, FL, 32901, US',
    );
    expect(getByTestId('provider-facility-org-name')).to.exist;
    expect(getByTestId('changes-copy')).to.exist;
  });
});
