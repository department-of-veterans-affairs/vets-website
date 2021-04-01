import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/dom';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import {
  getDirectBookingEligibilityCriteriaMock,
  getExpressCareRequestCriteriaMock,
  getVAFacilityMock,
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
  getTimezoneTestDate,
} from '../../../mocks/setup';

import reducers from '../../../../redux/reducer';
import AppointmentsPageV2 from '../../../../appointment-list/components/AppointmentsPage/AppointmentsPageV2';
import userEvent from '@testing-library/user-event';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS <AppointmentsPageV2>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });

  const userState = {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  };

  it('should show express care call to action when within express care window', async () => {
    mockAppointmentInfo({
      requests: [],
      va: [],
      cc: [],
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
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      initialState: initialStateWithExpressCare,
      reducers,
    });

    const header = await screen.findByText(
      'Request an Express Care appointment',
    );
    const button = await screen.findByText('Request Express Care');

    expect(screen.baseElement).to.contain.text(
      'request an Express Care appointment if you need to talk to VA health care staff',
    );
    expect(header).to.have.tagName('h2');

    expect(
      global.window.dataLayer.find(
        ev => ev.event === 'vaos-express-care-request-button-clicked',
      ),
    ).not.to.exist;
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-express-care-request',
      ),
    );
    expect(
      global.window.dataLayer.find(
        ev => ev.event === 'vaos-express-care-request-button-clicked',
      ),
    ).to.exist;
  });

  it('should navigate to list URLs on dropdown change', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: false,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      initialState: defaultState,
    });

    const dropdown = screen.getByLabelText('Show by type');
    fireEvent.change(dropdown, { target: { value: 'requested' } });

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/requested'),
    );

    fireEvent.change(dropdown, { target: { value: 'past' } });

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/past'),
    );

    fireEvent.change(dropdown, { target: { value: 'canceled' } });

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/canceled'),
    );

    fireEvent.change(dropdown, { target: { value: 'upcoming' } });

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/'),
    );
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
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCareNew: true,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      initialState: initialStateWithExpressCare,
    });

    await screen.findByText(/Express Care isn’t available right now/i);
    expect(screen.getByText(/request express care/i)).to.have.attribute(
      'disabled',
    );
  });

  it('should not show express care call to action when flag is off', async () => {
    mockAppointmentInfo({});
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCareNew: false,
      },
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      initialState: initialStateWithExpressCare,
    });

    await screen.findAllByText('Schedule a new appointment');
    expect(screen.queryByText(/Request Express Care/i)).to.not.be.ok;
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
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      initialState: initialStateWithExpressCare,
    });

    const button = await screen.findByText('Request Express Care');

    expect(button).to.not.have.attribute('disabled');
    expect(screen.baseElement).to.contain.text(
      `${closestStart.format('h:mm a')} to ${closestEnd.format('h:mm a')}`,
    );
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
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      store,
    });

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /You may have trouble using the VA appointments tool right now/,
      }),
    ).to.exist;
  });

  it('should render schedule radio list with primary care option', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: true,
      },
      user: userState,
    };
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
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

    userEvent.click(
      await screen.findByRole('link', { name: /Start scheduling/ }),
    );

    expect(await screen.findByRole('link', { name: /Start scheduling/ }));
    expect(screen.getByRole('heading', { level: 3 })).to.have.text(
      'COVID-19 vaccines',
    );
    expect(screen.getByText(/at this time, you can't schedule a COVID-19/i)).to
      .be.ok;
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

    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
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

  it('should render schedule radio list without COVID-19 vaccine option when call fails', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingCheetah: true,
      },
      user: userState,
    };

    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
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

    userEvent.click(
      await screen.findByRole('link', { name: /Start scheduling/ }),
    );

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/new-appointment'),
    );
  });
});
