import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/dom';
import environment from 'platform/utilities/environment';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import {
  createTestStore,
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../../mocks/setup';
import AppointmentsPageV2 from '../../../../appointment-list/components/AppointmentsPageV2';
import userEvent from '@testing-library/user-event';
import {
  mockAppointmentInfo,
  mockPastAppointmentInfo,
} from '../../../mocks/helpers';

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
    mockAppointmentInfo({});
  });
  afterEach(() => {
    MockDate.reset();
  });

  const userState = {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  };

  it('should navigate to list URLs on dropdown change', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: false,
      },
      user: userState,
    };
    mockPastAppointmentInfo({});
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      initialState: defaultState,
    });

    const dropdown = screen.getByLabelText('Show by status');
    fireEvent.change(dropdown, { target: { value: 'requested' } });

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/requested'),
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Requested appointments',
      }),
    );

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Requested | VA online scheduling | Veterans Affairs`,
      );
    });

    fireEvent.change(dropdown, { target: { value: 'past' } });

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/past'),
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Past appointments',
      }),
    );
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Past appointments | VA online scheduling | Veterans Affairs`,
      );
    });

    fireEvent.change(dropdown, { target: { value: 'canceled' } });

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/canceled'),
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Canceled appointments',
      }),
    );
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Canceled appointments | VA online scheduling | Veterans Affairs`,
      );
    });

    fireEvent.change(dropdown, { target: { value: 'upcoming' } });

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/'),
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Your appointments',
      }),
    );
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Your appointments | VA online scheduling | Veterans Affairs`,
      );
    });
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

  it('start scheduling button should open new appointment flow', async () => {
    const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
      initialState: {
        ...initialState,
        user: userState,
      },
    });

    expect(screen.getByText(/Schedule primary or specialty care appointments./))
      .to.be.ok;
    userEvent.click(
      await screen.findByRole('button', { name: /Start scheduling/i }),
    );

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/new-appointment'),
    );
  });
});
