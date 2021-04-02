import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import environment from 'platform/utilities/environment';
import {
  setFetchJSONFailure,
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import {
  getVARequestMock,
  getVideoAppointmentMock,
  getVAAppointmentMock,
  getCCAppointmentMock,
  getExpressCareRequestCriteriaMock,
  getVAFacilityMock,
  getDirectBookingEligibilityCriteriaMock,
} from '../../../mocks/v0';
import {
  mockAppointmentInfo,
  mockDirectBookingEligibilityCriteria,
  mockFacilitiesFetch,
  mockRequestEligibilityCriteria,
} from '../../../mocks/helpers';
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
    vaOnlineSchedulingExpressCareNew: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS integration: appointment list', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

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

  it('should show express care button and tab when within express care window', async () => {
    const request = getVARequestMock();
    request.attributes = {
      ...request.attributes,
      status: 'Submitted',
      typeOfCareId: 'CR1',
    };
    mockAppointmentInfo({
      requests: [request],
    });
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('2', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .add('1', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], [requestCriteria]);
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCareNew: true,
      },
      user: userState,
    };
    const {
      findByText,
      baseElement,
      getAllByRole,
      getByText,
      history,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: initialStateWithExpressCare,
    });

    const header = await findByText('Request a new Express Care appointment');
    const button = await findByText('Request Express Care');

    expect(baseElement).to.contain.text(
      'Talk to VA health care staff today about a condition',
    );
    expect(header).to.have.tagName('h2');
    expect(getAllByRole('tab').length).to.equal(3);
    const upcomingTab = getByText('Upcoming');
    expect(upcomingTab).to.have.attribute('role', 'tab');
    fireEvent.click(upcomingTab);
    expect(global.window.dataLayer.some(e => e.event === 'nav-tab-click')).to.be
      .true;
    expect(getByText('Past')).to.have.attribute('role', 'tab');
    expect(getByText('Express Care')).to.have.attribute('role', 'tab');
    expect(
      getByText(/Your upcoming, past, and Express Care appointments/i),
    ).to.have.tagName('h2');

    expect(
      global.window.dataLayer.find(
        ev => ev.event === 'vaos-express-care-request-button-clicked',
      ),
    ).not.to.exist;
    fireEvent.click(button);

    await waitFor(() =>
      expect(history.push.lastCall.args[0]).to.equal(
        '/new-express-care-request',
      ),
    );
    expect(
      global.window.dataLayer.find(
        ev => ev.event === 'vaos-express-care-request-button-clicked',
      ),
    ).to.exist;
  });

  it('should not show express care action when outside of express care window', async () => {
    mockAppointmentInfo({});
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('2', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .subtract('1', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], [requestCriteria]);
    const initialStateWithExpressCare = {
      featureToggles: initialState.featureToggles,
      user: userState,
    };
    const { findByText, getByText } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState: initialStateWithExpressCare,
      },
    );

    await findByText(/Express Care isn’t available right now/i);
    expect(getByText(/request express care/i)).to.have.attribute('disabled');
  });

  it('should show express care action but not tab when no requests', async () => {
    mockAppointmentInfo({});
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('2', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .add('1', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], [requestCriteria]);
    const initialStateWithExpressCare = {
      featureToggles: initialState.featureToggles,
      user: userState,
    };
    const {
      findByText,
      getAllByRole,
      getByText,
      findAllByText,
      getAllByText,
      queryByText,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: initialStateWithExpressCare,
    });

    await findByText('Request Express Care');
    expect(await findAllByText('Request a new Express Care appointment')).to.be
      .ok;
    expect(getAllByRole('tab').length).to.equal(2);
    expect(getAllByText('Upcoming appointments')[0]).to.have.attribute(
      'role',
      'tab',
    );
    expect(getByText('Past appointments')).to.have.attribute('role', 'tab');
    expect(queryByText(/Your upcoming, past, and Express Care appointments/i))
      .not.to.exist;
  });

  it('should display active express care facility closest to address', async () => {
    mockAppointmentInfo({});
    const today = moment();
    const closestStart = today
      .clone()
      .subtract('15', 'minutes')
      .tz('America/Denver');
    const closestEnd = today
      .clone()
      .add('5', 'minutes')
      .tz('America/Denver');
    mockRequestEligibilityCriteria(
      ['983'],
      [
        getExpressCareRequestCriteriaMock('983', [
          {
            day: today
              .clone()
              .tz('America/Denver')
              .format('dddd')
              .toUpperCase(),
            canSchedule: true,
            startTime: today
              .clone()
              .subtract('5', 'minutes')
              .tz('America/Denver')
              .format('HH:mm'),
            endTime: today
              .clone()
              .add('5', 'minutes')
              .tz('America/Denver')
              .format('HH:mm'),
          },
        ]),
        getExpressCareRequestCriteriaMock('983GC', [
          {
            day: closestStart.format('dddd').toUpperCase(),
            canSchedule: true,
            startTime: closestStart.format('HH:mm'),
            endTime: closestEnd.format('HH:mm'),
          },
        ]),
      ],
    );
    mockFacilitiesFetch('vha_442,vha_442GC', [
      {
        id: 'vha_442',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '442',
          // Chicago, IL
          lat: 41.87078943,
          long: -87.67642646,
        },
      },
      {
        id: 'vha_442GC',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '442GC',
          // Worcester, MA
          lat: 42.276982,
          long: -71.75977,
        },
      },
    ]);
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCareNew: true,
      },
      user: {
        profile: {
          ...userState.profile,
          vapContactInfo: {
            residentialAddress: {
              // Northampton, MA
              latitude: 42.3495,
              longitude: -72.682407,
            },
          },
        },
      },
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: initialStateWithExpressCare,
    });

    const button = await screen.findByText('Request Express Care');

    expect(button).to.not.have.attribute('disabled');
    expect(screen.baseElement).to.contain.text(
      `${closestStart.format('h:mm a')} to ${closestEnd.format('h:mm a')}`,
    );
  });

  it('should allow tabbing to tab group, but not individual tabs', async () => {
    const request = getVARequestMock();
    request.attributes = {
      ...request.attributes,
      status: 'Submitted',
      typeOfCareId: 'CR1',
    };
    mockAppointmentInfo({
      requests: [request],
    });
    mockRequestEligibilityCriteria(['983'], []);
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCareNew: true,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: initialStateWithExpressCare,
    });

    expect(
      await screen.findByRole('tab', {
        name: 'upcoming appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');
    expect(
      screen.getByRole('tab', {
        name: 'past appointments',
        selected: false,
      }),
    ).to.have.attribute('tabindex', '-1');
    expect(
      screen.getByRole('tab', {
        name: 'express care appointments',
        selected: false,
      }),
    ).to.have.attribute('tabindex', '-1');

    userEvent.click(
      screen.getByRole('tab', {
        name: 'past appointments',
      }),
    );

    expect(
      await screen.findByRole('tab', {
        name: 'past appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');
    expect(
      screen.getByRole('tab', {
        name: 'upcoming appointments',
        selected: false,
      }),
    ).to.have.attribute('tabindex', '-1');
    expect(
      screen.getByRole('tab', {
        name: 'express care appointments',
        selected: false,
      }),
    ).to.have.attribute('tabindex', '-1');
  });

  it('should call next tab on arrow right', async () => {
    const request = getVARequestMock();
    request.attributes = {
      ...request.attributes,
      status: 'Submitted',
      typeOfCareId: 'CR1',
      reasonForVisit: 'Back pain',
    };
    mockAppointmentInfo({
      requests: [request],
      va: [],
    });
    mockRequestEligibilityCriteria(['983'], []);
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCareNew: true,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: initialStateWithExpressCare,
    });

    expect(
      await screen.findByRole('tab', {
        name: 'upcoming appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');

    // triggers arrow right key

    fireEvent.keyDown(
      screen.getByRole('tab', {
        name: 'upcoming appointments',
        selected: true,
      }),
      { key: 'ArrowRight', keyCode: 39 },
    );

    expect(document.activeElement.id).to.equal('tabpast');

    expect(
      screen.getByRole('tab', {
        name: 'past appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');
    expect(
      screen.getByRole('tab', {
        name: 'upcoming appointments',
        selected: false,
      }),
    ).to.have.attribute('tabindex', '-1');

    // triggers arrow right key

    fireEvent.keyDown(
      await screen.findByRole('tab', {
        name: 'past appointments',
        selected: true,
      }),
      { key: 'ArrowRight', keyCode: 39 },
    );
    expect(document.activeElement.id).to.equal('tabexpress-care');
    expect(
      screen.getByRole('tab', {
        name: 'express care appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');
    expect(
      screen.getByRole('tab', {
        name: 'past appointments',
        selected: false,
      }),
    ).to.have.attribute('tabindex', '-1');
  });

  it('should call previous tab on left right', async () => {
    const request = getVARequestMock();
    request.attributes = {
      ...request.attributes,
      status: 'Submitted',
      typeOfCareId: 'CR1',
      reasonForVisit: 'Back pain',
    };
    mockAppointmentInfo({
      requests: [request],
      va: [],
    });
    mockRequestEligibilityCriteria(['983'], []);
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCareNew: true,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: initialStateWithExpressCare,
    });

    expect(
      await screen.findByRole('tab', {
        name: 'upcoming appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');

    // move to the express care tab

    userEvent.click(
      screen.getByRole('tab', {
        name: 'express care appointments',
      }),
    );

    expect(
      await screen.findByRole('tab', {
        name: 'express care appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');

    // triggers arrow left key

    fireEvent.keyDown(
      screen.getByRole('tab', {
        name: 'express care appointments',
        selected: true,
      }),
      { key: 'ArrowLeft', keyCode: 37 },
    );

    expect(document.activeElement.id).to.equal('tabpast');

    expect(
      screen.getByRole('tab', {
        name: 'past appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');
    expect(
      screen.getByRole('tab', {
        name: 'express care appointments',
        selected: false,
      }),
    ).to.have.attribute('tabindex', '-1');

    // triggers arrow left key

    fireEvent.keyDown(
      await screen.findByRole('tab', {
        name: 'past appointments',
        selected: true,
      }),
      { key: 'ArrowLeft', keyCode: 37 },
    );
    expect(document.activeElement.id).to.equal('tabupcoming');
    expect(
      screen.getByRole('tab', {
        name: 'upcoming appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');
    expect(
      screen.getByRole('tab', {
        name: 'past appointments',
        selected: false,
      }),
    ).to.have.attribute('tabindex', '-1');
  });

  it('should focus on tab panel on arrow down', async () => {
    const request = getVARequestMock();
    request.attributes = {
      ...request.attributes,
      status: 'Submitted',
      typeOfCareId: 'CR1',
      reasonForVisit: 'Back pain',
    };
    mockAppointmentInfo({
      requests: [request],
      va: [],
    });
    mockRequestEligibilityCriteria(['983'], []);
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCareNew: true,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: initialStateWithExpressCare,
    });

    expect(
      await screen.findByRole('tab', {
        name: 'upcoming appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');

    userEvent.click(
      screen.getByRole('tab', {
        name: 'express care appointments',
      }),
    );

    expect(
      await screen.findByRole('tab', {
        name: 'express care appointments',
        selected: true,
      }),
    ).to.not.have.attribute('tabindex');

    // triggers arrow down key

    fireEvent.keyDown(
      screen.getByRole('tab', {
        name: 'express care appointments',
        selected: true,
      }),
      { key: 'ArrowDown', keyCode: 40 },
    );

    expect(document.activeElement.id).to.equal('tabpanelexpress-care');
    expect(screen.getByText(/Back pain/i)).to.exist;
  });

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
    mockDirectBookingEligibilityCriteria(
      ['983'],
      [
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: 'covid',
        }),
      ],
    );

    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: defaultState,
    });
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Schedule a new appointment/,
      }),
    );

    expect(await screen.findAllByRole('radio')).to.have.length(2);

    expect(screen.getByText(/Choose an appointment type$/)).to.be.ok;

    userEvent.click(
      await screen.findByRole('radio', { name: 'COVID-19 vaccine' }),
    );

    userEvent.click(
      await screen.findByRole('link', { name: /Start scheduling/ }),
    );

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-covid-19-vaccine-booking',
      ),
    );
  });

  it('should render schedule radio list without COVID-19 vaccine option', async () => {
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

    expect(await screen.findByText(/start scheduling/i)).be.ok;

    expect(screen.queryByRole('radio')).not.to.exist;
    expect(screen.getByRole('heading', { name: /COVID-19 vaccines/, level: 3 }))
      .to.be.ok;
    expect(screen.getByText(/at this time, you can't schedule a COVID-19/i)).to
      .be.ok;

    userEvent.click(
      await screen.findByRole('link', { name: /Start scheduling/ }),
    );

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/new-appointment'),
    );
  });
});
