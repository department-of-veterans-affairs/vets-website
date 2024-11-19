import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { format } from 'date-fns';
import ScheduleReferral from './ScheduleReferral';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import TempData, { referral } from './temp-data/referral';
import * as ReferralServices from '../services/referral';
import ScheduleReferral from './ScheduleReferral';
import { createReferral } from './utils/referrals';

describe('scheduleReferral component', () => {
  it('should display the loading indicator while data is being fetched', async () => {
    const store = createTestStore();
    const sandbox = sinon.createSandbox();
    sandbox.stub(TempData, 'referral').value(null);
    sandbox.stub(ReferralServices, 'getPatientReferralById').resolves();

    const screen = renderWithStoreAndRouter(<ScheduleReferral />, { store });
    expect(await screen.findByTestId('loading-indicator')).to.exist;

    sandbox.restore();
  });

  it('should display the error message if data fetching fails', async () => {
    const store = createTestStore();
    const sandbox = sinon.createSandbox();
    sandbox.stub(TempData, 'referral').value(null);
    sandbox
      .stub(ReferralServices, 'getPatientReferralById')
      .rejects(new Error('Network error'));

    const screen = renderWithStoreAndRouter(<ScheduleReferral />, { store });
    const errorMessage = await screen.findByText(
      'There was an error trying to get your referral data',
    );
    expect(errorMessage).to.exist;
    sandbox.restore();
  });

  it('should display the subtitle correctly given different numbers of appointments', async () => {
    const referralOne = createReferral(new Date(), '111');
    const store = createTestStore();
    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referralOne} />,
      {
        store,
      },
    );
    const subtitle = await screen.findByTestId('subtitle');
    expect(subtitle).to.contain.text('1 appointment');
  });
  it('should display the subtitle correctly given 2 appointments', async () => {
    const referralTwo = createReferral(new Date(), '222');
    const store = createTestStore();
    referralTwo.numberOfAppointments = 2;
    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referralTwo} />,
      {
        store,
      },
    );
    const subtitle = await screen.findByTestId('subtitle');
    expect(subtitle).to.contain.text('2 appointments');
  });

  it('should render with default data', async () => {
    const store = createTestStore();
    const sandbox = sinon.createSandbox();

    const screen = renderWithStoreAndRouter(<ScheduleReferral />, {
      store,
    });

    const details = await screen.findByTestId('referral-details');
    const facility = await screen.findByTestId('referral-facility');

    const helpText = screen.findByTestId('help-text');

    expect(details).to.exist;
    expect(details).to.contain.text(
      format(referral.expirationDate, 'MMMM d, yyyy'),
    );
    expect(details).to.contain.text('Type of care: Dermatology');
    expect(details).to.contain.text('Provider: Dr. Face');
    expect(details).to.contain.text('Location: New skin technologies bldg 2');
    expect(details).to.contain.text('Number of appointments: 2');
    expect(details).to.contain.text('Referral number: 1234567890');
    expect(helpText).to.exist;

    expect(facility).to.exist;
    expect(facility).to.contain.text(
      'Referring VA facility: Syracuse VA Medical Center',
    );
    expect(facility).to.contain.text('Phone: 555-555-5555');

    sandbox.restore();
  });
});
