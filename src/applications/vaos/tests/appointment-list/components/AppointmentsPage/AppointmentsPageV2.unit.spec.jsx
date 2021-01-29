import React from 'react';
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
  getExpressCareRequestCriteriaMock,
  getVAAppointmentMock,
  getVAFacilityMock,
} from '../../../mocks/v0';
import {
  mockAppointmentInfo,
  mockFacilitiesFetch,
  mockRequestEligibilityCriteria,
} from '../../../mocks/helpers';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import reducers from '../../../../redux/reducer';
import AppointmentsPageV2 from '../../../../appointment-list/components/AppointmentsPage/AppointmentsPageV2';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ConfirmedAppointmentDetailsPage from '../../../../appointment-list/components/ConfirmedAppointmentDetailsPage';

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

    fireEvent.change(dropdown, { target: { value: 'cancelled' } });

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/cancelled'),
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

    await screen.findAllByText('Request an appointment');
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

  it('should render schedule button with direct schedule text', async () => {
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

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Schedule an appointment/,
      }),
    );
    expect(screen.getByText(/at a VA medical center or clinic/)).to.be.ok;
    expect(screen.getByRole('link', { name: 'Schedule appointment' }));
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
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      initialState: defaultState,
    });

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Schedule an appointment/,
      }),
    );
    expect(
      screen.getByText(
        /at a VA medical center, clinic, approved or community care facility./,
      ),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: 'Schedule appointment' }));
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
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      initialState: defaultState,
      reducers,
    });

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Request an appointment/,
      }),
    );
    expect(screen.getByText(/at a VA medical center or clinic/)).to.be.ok;
    expect(screen.getByRole('link', { name: 'Request appointment' }));
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
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
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
        /at a VA medical center, clinic, approved or community care facility./,
      ),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: 'Request appointment' }));
  });

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
          fax: '970-407-7440',
          main: '970-224-1550',
          pharmacy: '866-420-6337',
          afterHours: '307-778-7550',
          patientAdvocate: '307-778-7550 x7517',
          mentalHealthClinic: '307-778-7349',
          enrollmentCoordinator: '307-778-7550 x7579',
        },
        uniqueId: '442GC',
      },
    };
    mockFacilitiesFetch('vha_442GC', [facility]);

    const screen = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/', url]}>
        <Route exact path="/" component={AppointmentsPageV2} />
        <Route
          exact
          path="/va/:id"
          component={ConfirmedAppointmentDetailsPage}
        />
      </MemoryRouter>,
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
        name: new RegExp(moment().format('dddd, MMMM DD, YYYY'), 'i'),
      }),
    ).to.be.ok;

    // NOTE: This 2nd 'await' is needed!!! Seems like we need to wait for
    // conditionals to process in addition to any async code.
    expect(await screen.findByText(/Fort Collins VA Clinic/)).to.be.ok;
    expect(screen.getByText(/Jennie's Lab/)).to.be.ok;
    expect(screen.getByRole('link', { name: /9 7 0. 2 2 4. 1 5 5 0./ })).to.be
      .ok;
    expect(screen.getByRole('heading', { level: 2, name: /New issue/ })).to.be
      .ok;
    expect(
      screen.getByRole('link', {
        name: new RegExp(
          moment().format('[Add] MMMM DD, YYYY [appointment to your calendar]'),
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
        name: new RegExp(moment().format('dddd, MMMM DD, YYYY'), 'i'),
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
