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
      await screen.findByRole('button', { name: /Start scheduling/i }),
    );

    expect(await screen.findByRole('button', { name: /Start scheduling/i }));
    expect(screen.getByRole('heading', { level: 3 })).to.have.text(
      'COVID-19 vaccines',
    );
    expect(screen.getByText(/at this time, you can't schedule a COVID-19/i)).to
      .be.ok;
  });

  it('should render schedule radio list with Primary or specialty care option', async () => {
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

    await waitFor(() => {
      expect(screen.getAllByRole('radio')).to.have.length(2);
    });

    expect(screen.getByText(/Choose an appointment type\./)).to.be.ok;

    userEvent.click(
      await screen.findByRole('radio', { name: 'Primary or specialty care' }),
    );

    userEvent.click(
      await screen.findByRole('button', { name: /Start scheduling/i }),
    );

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/new-appointment'),
    );
  });

  it('should render schedule radio list with COVID-19 vaccine option', async () => {
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
