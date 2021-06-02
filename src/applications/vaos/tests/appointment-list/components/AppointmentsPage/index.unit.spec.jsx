import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import environment from 'platform/utilities/environment';
import {
  setFetchJSONFailure,
  mockFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import {
  getVARequestMock,
  getVideoAppointmentMock,
  getVAAppointmentMock,
  getCCAppointmentMock,
} from '../../../mocks/v0';
import { mockAppointmentInfo } from '../../../mocks/helpers';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import AppointmentsPage from '../../../../appointment-list/components/AppointmentsPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS integration: appointment list', () => {
  beforeEach(() => mockFetch());

  it('should sort appointments by date, with requests at the end', async () => {
    const firstDate = moment().add(3, 'days');
    const secondDate = moment().add(4, 'days');
    const thirdDate = moment().add(5, 'days');
    const fourthDate = moment().add(6, 'days');
    const request = getVARequestMock();
    request.attributes = {
      ...request.attributes,
      status: 'Submitted',
      appointmentType: 'Primary care',
      optionDate1: firstDate.format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: secondDate.format(),
      vdsAppointments: [
        {
          bookingNote: 'My reason isn’t listed: Looking for a reason',
        },
      ],
    };
    const videoAppointment = getVideoAppointmentMock();
    videoAppointment.attributes = {
      ...videoAppointment.attributes,
      clinicId: null,
      startDate: thirdDate.format(),
    };
    videoAppointment.attributes.vvsAppointments[0] = {
      ...videoAppointment.attributes.vvsAppointments[0],
      dateTime: thirdDate.format(),
      status: { description: 'F', code: 'FUTURE' },
    };
    const ccAppointment = getCCAppointmentMock();
    ccAppointment.attributes = {
      ...ccAppointment.attributes,
      appointmentTime: fourthDate.format('MM/DD/YYYY HH:mm:ss'),
      timeZone: 'UTC',
    };
    mockAppointmentInfo({
      va: [videoAppointment, appointment],
      cc: [ccAppointment],
      requests: [request],
    });

    const { baseElement, findAllByRole, getByText } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    await findAllByRole('list');

    const dateHeadings = Array.from(
      baseElement.querySelectorAll('#appointments-list h3'),
    ).map(card => card.textContent.trim());

    expect(dateHeadings).to.deep.equal([
      secondDate.format('dddd, MMMM D, YYYY [at] h:mm a'),
      thirdDate.format('dddd, MMMM D, YYYY [at] h:mm a'),
      fourthDate.format('dddd, MMMM D, YYYY [at] h:mm a [UTC UTC]'),
      'Primary care appointment',
    ]);
    expect(baseElement.querySelector('h4')).to.be.ok;
    expect(getByText(/My reason isn’t listed/i)).to.be.ok;
  });

  it('should sort requests by type of care', async () => {
    const request = getVARequestMock();
    request.attributes = {
      ...request.attributes,
      status: 'Submitted',
      appointmentType: 'Primary care',
      optionDate1: moment()
        .add(4, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };
    const requests = [request];
    requests.push({
      ...request,
      attributes: {
        ...request.attributes,
        appointmentType: 'Audiology',
      },
    });
    requests.push({
      ...request,
      attributes: {
        ...request.attributes,
        appointmentType: 'Mental health',
      },
    });
    mockAppointmentInfo({
      requests,
    });

    const { baseElement, findAllByRole } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    await findAllByRole('list');

    const dateHeadings = Array.from(
      baseElement.querySelectorAll('#appointments-list h3'),
    ).map(card => card.textContent.trim());

    expect(dateHeadings).to.deep.equal([
      'Audiology appointment',
      'Mental health appointment',
      'Primary care appointment',
    ]);

    expect(baseElement.querySelector('h4')).to.be.ok;
  });

  it('should show no appointments message when there are no appointments', () => {
    mockAppointmentInfo({});

    const { findByText } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    return expect(findByText(/You don’t have any appointments/i)).to.eventually
      .be.ok;
  });

  it('should show error message when an item request fails', async () => {
    mockAppointmentInfo({});
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
          .startOf('day')
          .toISOString()}&end_date=${moment()
          .add(395, 'days')
          .startOf('day')
          .toISOString()}&type=va`,
      ),
      { errors: [] },
    );

    const { baseElement, findByText } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    await findByText('We’re sorry. We’ve run into a problem');

    expect(baseElement.querySelector('.usa-alert-error')).to.be.ok;
    expect(baseElement).not.to.contain.text('You don’t have any appointments');
  });

  const userState = {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  };

  it('should render warning message', async () => {
    setFetchJSONResponse(
      global.fetch.withArgs(`${environment.API_URL}/v0/maintenance_windows/`),
      {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'vaosWarning',
              description: 'My description',
              startTime: moment.utc().subtract('1', 'days'),
              endTime: moment.utc().add('1', 'days'),
            },
          },
        ],
      },
    );
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      store,
    });

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /You may have trouble using the VA appointments tool right now/,
      }),
    ).to.exist;
  });

  it('should render schedule button with direct schedule text', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: false,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: defaultState,
    });

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Create a new appointment/,
      }),
    );
    expect(
      screen.getByText(
        /Schedule an appointment at a VA medical center or clinic./,
      ),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: 'Schedule an appointment' }));
  });

  it('should render schedule button with direct schedule text for community care', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: true,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: defaultState,
    });

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Create a new appointment/,
      }),
    );
    expect(
      screen.getByText(
        /Schedule an appointment at a VA medical center, clinic, or community care facility./,
      ),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: 'Schedule an appointment' }));
  });

  it('should render schedule button with request appointment text', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: false,
        vaOnlineSchedulingCommunityCare: false,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: defaultState,
    });

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Request an appointment/,
      }),
    );
    expect(
      screen.getByText(
        /You can submit a request for an appointment at a VA medical center or clinic./,
      ),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: 'Request an appointment' }));
  });

  it('should render schedule button with request appointment text for communty care', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: false,
        vaOnlineSchedulingCommunityCare: true,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: defaultState,
    });

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Request an appointment/,
      }),
    );
    expect(
      screen.getByText(
        /You can submit a request for an appointment at a VA medical center, clinic, or approved Community Care facility./,
      ),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: 'Request an appointment' }));
  });

  it('should render schedule radio list with COVID-19 vaccine option', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingCheetah: true,
      },
      user: userState,
    };

    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: defaultState,
    });
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Schedule a new appointment/,
      }),
    );

    await waitFor(() => {
      expect(screen.getAllByRole('radio')).to.have.length(2);
    });

    expect(screen.getByText(/Choose an appointment type\./)).to.be.ok;

    userEvent.click(
      await screen.findByRole('radio', { name: 'COVID-19 vaccine' }),
    );

    userEvent.click(
      await screen.findByRole('button', { name: /Start scheduling/i }),
    );

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-covid-19-vaccine-booking',
      ),
    );
  });
});
