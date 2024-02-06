import React from 'react';
import moment from 'moment';
import MockDate from 'mockdate';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import userEvent from '@testing-library/user-event';
import {
  mockSingleVAOSAppointmentFetch,
  mockVAOSAppointmentsFetch,
} from '../../mocks/helpers.v2';
import { renderWithStoreAndRouter, getTestDate } from '../../mocks/setup';
import { createMockAppointmentByVersion } from '../../mocks/data';

import { AppointmentList } from '../../../appointment-list';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
    vaOnlineSchedulingStatusImprovement: false,
  },
};

describe('VAOS <CommunityCareAppointmentDetailsPage> with VAOS service', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });
  afterEach(() => {
    MockDate.reset();
  });

  // TODO [rs] WIP: need to update test
  it.skip('should navigate to community care appointments detail page', async () => {
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');
    const start = moment()
      .subtract(30, 'days')
      .format('YYYY-MM-DD');
    const end = moment()
      .add(395, 'days')
      .format('YYYY-MM-DD');

    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      localStartTime: appointmentTime.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
      serviceType: 'audiology',
      reasonCode: {
        text: 'test comment',
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockSingleVAOSAppointmentFetch({ appointment });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
        },
      },
    });

    let detailLinks = await screen.findAllByRole('link', { name: /Detail/i });

    // Select an appointment details link...
    let detailLink = detailLinks.find(l => l.getAttribute('href') === url);
    userEvent.click(detailLink);

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.getByText(/Type of care/)).to.be.ok;
    expect(screen.getByText(/Community care/)).to.be.ok;
    expect(await screen.findByText(/Atlantic Medical Care/)).to.be.ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Special instructions/,
      }),
    ).to.be.ok;
    expect(screen.getByText(/test comment/)).to.be.ok;
    expect(
      screen.getByTestId('add-to-calendar-link', {
        name: `Add ${appointmentTime.format(
          'MMMM D, YYYY',
        )} appointment to your calendar`,
      }),
    ).to.be.ok;
    expect(screen.getByText(/Print/)).to.be.ok;

    // Verify back button works...
    userEvent.click(screen.getByText(/Back to appointments/i));
    detailLinks = await screen.findAllByRole('link', { name: /Detail/i });
    detailLink = detailLinks.find(a => a.getAttribute('href') === url);

    // Go back to Appointment detail...
    userEvent.click(detailLink);

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    // Verify breadcrumb links works...
    const VAOSHomepageLink = await screen.findByRole('link', {
      name: /Back to appointments/i,
    });
    userEvent.click(VAOSHomepageLink);
    expect(await screen.findAllByText(/Detail/)).to.be.ok;
  });

  it('should show cc info when directly opening page', async () => {
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');

    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      localStartTime: appointmentTime.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
        },
      },
      path: url,
    });

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.getByText(/Community care/)).to.be.ok;
    expect(screen.getByText(/Atlantic Medical Care/)).to.be.ok;
  });

  it('should not display type of care when serviceType is missing or null', async () => {
    // Given when the staff schedules the Community Care appointment for the Veteran
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');
    // When the serviceType is blank or null
    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      localStartTime: appointmentTime.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
        },
      },
      path: url,
    });

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.getByText(/Community care/)).to.be.ok;
    expect(screen.getByText(/Atlantic Medical Care/)).to.be.ok;
    // Then the appointment details will not display the type of care label
    expect(screen.queryByText(/Type of care/i)).not.to.exist;
  });

  it('should not display treatment specialty if treatmentSpecialty is missing and vaOnlineSchedulingVAOSV2Next is true', async () => {
    // Given when the staff schedules the Community Care appointment for the Veteran
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');
    // When the treatmentSpecialty is blank or null
    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      localStartTime: appointmentTime.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
          vaOnlineSchedulingVAOSV2Next: true,
        },
      },
      path: url,
    });

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.queryByTestId('appointment-treatment-specialty')).to.be.null;
  });

  it('should not display treatment specialty if treatmentSpecialty is empty and vaOnlineSchedulingVAOSV2Next is true', async () => {
    // Given when the staff schedules the Community Care appointment for the Veteran
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');
    // When the treatmentSpecialty is blank or null
    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      localStartTime: appointmentTime.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
        treatmentSpecialty: '',
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
          vaOnlineSchedulingVAOSV2Next: true,
        },
      },
      path: url,
    });

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.queryByTestId('appointment-treatment-specialty')).to.be.null;
  });

  it('should not display treatment specialty if treatmentSpecialty is null and vaOnlineSchedulingVAOSV2Next is true', async () => {
    // Given when the staff schedules the Community Care appointment for the Veteran
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');
    // When the treatmentSpecialty is blank or null
    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      localStartTime: appointmentTime.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
        treatmentSpecialty: null,
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
          vaOnlineSchedulingVAOSV2Next: true,
        },
      },
      path: url,
    });

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.queryByTestId('appointment-treatment-specialty')).to.be.null;
  });

  it('should not display treatment specialty if treatmentSpecialty is is present and vaOnlineSchedulingVAOSV2Next is false', async () => {
    // Given when the staff schedules the Community Care appointment for the Veteran
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');
    // When the treatmentSpecialty is blank or null
    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      localStartTime: appointmentTime.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
        treatmentSpecialty: 'Optometry',
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
          vaOnlineSchedulingVAOSV2Next: false,
        },
      },
      path: url,
    });

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.queryByTestId('appointment-treatment-specialty')).to.be.null;
  });

  it('should not show "Add to Calendar" for canceled appointments', async () => {
    // Given a user with a canceled CC appointment
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');

    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      localStartTime: appointmentTime.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
      status: 'cancelled',
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    // When the page displays
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
        },
      },
      path: url,
    });

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    // Then the canceled status message should be displayed
    expect(screen.getByText(/Facility canceled your appointment/)).to.be.ok;

    // Then the 'Add to calendar' link should not be displayed
    expect(screen.queryByTestId('add-to-calendar-link')).not.to.exist;
  });

  it('should navigate to community care appointments detail page', async () => {});

  it('should fire a print request when print button clicked', async () => {});

  it('should show an error when cc data fetch fails', async () => {});

  it('should show an error when CC appointment not found in list', async () => {});

  it('should show cc appointment from vista when directly opening page', async () => {});

  it('should verify community care calendar ics file format', async () => {});

  it('should verify community care calendar ics file format when there is no provider information', async () => {});
});
