import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { getVAAppointmentMock, getVAFacilityMock } from '../../mocks/v0';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../../mocks/helpers';
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

describe('VAOS <AppointmentsPageV2>', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should navigate to confirmed appointments detail page', async () => {
    // VA appointment id from confirmed_va.json
    const url = '/va/var21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: moment().format(),
      clinicId: '308',
      clinicFriendlyName: "Jennie's Lab",
      facilityId: '983',
      sta6aid: '983GC',
      communityCare: false,
      vdsAppointments: [
        {
          bookingNote: 'New issue: ASAP',
          appointmentLength: '60',
          appointmentTime: '2021-12-07T16:00:00Z',
          clinic: {
            name: 'CHY OPT VAR1',
            askForCheckIn: false,
            facilityCode: '983',
          },
          type: 'REGULAR',
          currentStatus: 'NO ACTION TAKEN/TODAY',
        },
      ],
      vvsAppointments: [],
    };

    mockAppointmentInfo({
      va: [appointment],
      cc: [],
      requests: [],
      isHomepageRefresh: true,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        type: 'facility',
        address: {
          mailing: {},
          physical: {
            zip: '80526-8108',
            city: 'Fort Collins',
            state: 'CO',
            address1: '2509 Research Boulevard',
            address2: null,
            address3: null,
          },
        },
        id: 'vha_442GC',
        name: 'Fort Collins VA Clinic',
        phone: {
          main: '970-224-1550',
        },
        uniqueId: '442GC',
      },
    };
    mockFacilitiesFetch('vha_442GC', [facility]);

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
        name: new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'),
      }),
    ).to.be.ok;

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Fort Collins VA Clinic/)).to.be.ok;
    expect(screen.getByText(/Jennie's Lab/)).to.be.ok;
    expect(screen.getByRole('link', { name: /9 7 0. 2 2 4. 1 5 5 0./ })).to.be
      .ok;
    expect(screen.getByRole('heading', { level: 2, name: /New issue/ })).to.be
      .ok;
    expect(
      screen.getByRole('link', {
        name: new RegExp(
          moment().format('[Add] MMMM D, YYYY [appointment to your calendar]'),
          'i',
        ),
      }),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: /Print/ })).to.be.ok;
    expect(screen.getByRole('link', { name: /Reschedule/ })).to.be.ok;

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
        name: new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'),
        // name: /Thursday, January 28, 2021/,
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
