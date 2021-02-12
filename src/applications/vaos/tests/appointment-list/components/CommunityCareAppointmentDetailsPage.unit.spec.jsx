import React from 'react';
import { expect } from 'chai';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { getCCAppointmentMock } from '../../mocks/v0';
import { mockAppointmentInfo } from '../../mocks/helpers';
import { renderWithStoreAndRouter } from '../../mocks/setup';

import userEvent from '@testing-library/user-event';
import { AppointmentList } from '../../../appointment-list';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

describe('VAOS <CommunityCareAppointmentDetailsPage>', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should navigate to community care appointments detail page', async () => {
    // CC appointment id from confirmed_cc.json
    const url = '/cc/8a4885896a22f88f016a2cb7f5de0062';

    const appointment = getCCAppointmentMock();
    appointment.id = '8a4885896a22f88f016a2cb7f5de0062';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentRequestId: '8a4885896a22f88f016a2cb7f5de0062',
      distanceEligibleConfirmed: true,
      name: { firstName: 'Rick', lastName: 'Katz' },
      providerPractice: 'My Eye Dr',
      providerPhone: '(703) 555-1264',
      address: {
        street: '123',
        city: 'Burke',
        state: 'VA',
        zipCode: '20151',
      },
      instructionsToVeteran: 'Bring your glasses',
      appointmentTime: '05/20/2021 14:15:00',
      timeZone: 'UTC',
    };

    mockAppointmentInfo({
      va: [],
      cc: [appointment],
      requests: [],
      isHomepageRefresh: true,
    });

    const screen = renderWithStoreAndRouter(
      <AppointmentList featureHomepageRefresh />,
      {
        initialState,
      },
    );

    let detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    // Select an appointment details link...
    let detailLink = detailLinks.find(l => l.getAttribute('href') === url);
    userEvent.click(detailLink);

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /^Thursday, May 20, 2021/,
      }),
    ).to.be.ok;

    expect(screen.getByText(/Community care/)).to.be.ok;
    expect(screen.getByText(/123/)).to.be.ok;
    expect(screen.getByText(/Burke,/)).to.be.ok;
    expect(screen.getByRole('link', { name: /7 0 3. 5 5 5. 1 2 6 4./ })).to.be
      .ok;
    expect(
      screen.getByRole('heading', { level: 2, name: /Special instructions/ }),
    ).to.be.ok;
    expect(screen.getByText(/Bring your glasses/)).to.be.ok;
    expect(
      screen.getByRole('link', {
        name: /^Add May 20, 2021 appointment to your calendar/,
      }),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: /Print/ })).to.be.ok;

    const button = screen.getByRole('button', {
      name: /Go back to appointments/,
    });
    expect(button).to.be.ok;

    // Verify back button works...
    userEvent.click(button);
    detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });
    detailLink = detailLinks.find(a => a.getAttribute('href') === url);

    // Go back to details page...
    userEvent.click(detailLink);

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /^Thursday, May 20, 2021/,
      }),
    ).to.be.ok;

    // Verify 'Manage appointments' link works...
    const manageAppointmentLink = await screen.findByRole('link', {
      name: /Manage appointments/,
    });
    userEvent.click(manageAppointmentLink);
    expect(await screen.findAllByText(/Detail/)).to.be.ok;
  });
});
