import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ScheduleReferral from './ScheduleReferral';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { referral } from './temp-data/referral';

describe('scheduleReferral component', () => {
  it('should display the subtitle correctly given different numbers of appointments', async () => {
    const store = createTestStore();
    const sandbox = sinon.createSandbox();
    sandbox.stub(referral, 'appointmentCount').value(1);
    const screen = renderWithStoreAndRouter(<ScheduleReferral />, {
      store,
    });
    const subtitle = await screen.findByTestId('subtitle');
    expect(subtitle).to.contain.text('1 appointment');
    sandbox.restore();
  });
  it('should display the subtitle correctly given 2 appointments', async () => {
    const store = createTestStore();
    const sandbox = sinon.createSandbox();
    sandbox.stub(referral, 'appointmentCount').value(2);
    referral.appointmentCount = 2;
    const screen = renderWithStoreAndRouter(<ScheduleReferral />, {
      store,
    });
    const subtitle = await screen.findByTestId('subtitle');
    expect(subtitle).to.contain.text('2 appointments');
    sandbox.restore();
  });
});
