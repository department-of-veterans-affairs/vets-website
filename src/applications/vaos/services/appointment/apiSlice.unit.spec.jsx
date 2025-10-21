import {
  createTestHistory,
  mockFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import { addDays, addMonths, format, subDays } from 'date-fns';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import {
  mockAppointmentApi,
  mockAppointmentsApi,
} from '../../tests/mocks/mockApis';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import slice, {
  selectAppointment,
  selectAppointmentRequest,
  selectAppointments,
  useGetAppointmentQuery,
  useGetAppointmentsQuery,
  useGetAppointmentRequestQuery,
  useGetAppointmentRequestsQuery,
  selectAppointmentRequests,
  selectAppointmentsGroupByMonth,
} from './apiSlice';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import confirmed from '../mocks/v2/confirmed.json';

export function TestPageStub() {
  // const id = useParams();

  const resp = useGetAppointmentsQuery();
  // NOTE: This works as well.
  // const resp = slice.endpoints.getAppointments.useQuery();

  // console.log('selectAppointmentRequest', useSelector(selectAppointments));

  if (resp.isLoading) return <div>Loading</div>;
  if (resp.isSuccess) return <div>Success</div>;
  if (resp.isError) return <div>Error</div>;

  return null;
}

describe('VAOS Appointment slice', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {});

  it('should verify data is normalized', async () => {
    // Arrange
    const history = createTestHistory('/1');
    const store = createTestStore();
    const wrapper = ({ children }) => (
      <Provider store={store}>
        <Router history={history} path="/:id">
          {children}
        </Router>
      </Provider>
    );

    console.log(
      mockAppointmentsApi({
        start: subDays(new Date(), 30),
        end: addDays(new Date(), 395),
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
        // includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        // response: [
        //   { id: '1', type: 'appointment', attributes: { type: 'VA' } },
        // ],
        response: confirmed,
      }),
    );

    // Act
    const screen = renderHook(
      () => {
        // Always return a value so you can test results!
        return useGetAppointmentsQuery();
        // const result = useGetAppointmentsQuery();
        // console.log('result', result);
        // return result;
      },
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.result.current.isSuccess).to.be.true;
    });
    console.log(
      JSON.stringify(
        store.getState().appointmentsRTK.queries['getAppointments(undefined)'],
      ),
    );
    // console.log(JSON.stringify(store.getState().appointmentsRTK.queries['getAppointments(undefined)'].data));
  });

  it('should verify selectAppointment returns data', async () => {
    // Arrange
    const history = createTestHistory('/1');
    const store = createTestStore();
    const wrapper = ({ children }) => (
      <Provider store={store}>
        <Router history={history} path="/:id">
          {children}
        </Router>
      </Provider>
    );

    console.log(
      mockAppointmentApi({
        // includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: { id: '1', type: 'appointment', attributes: {} },
      }),
    );

    // Act
    const screen = renderHook(
      () => {
        // Always return a value so you can test results!
        return useGetAppointmentQuery({ id: '1' });
      },
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.result.current.isSuccess).to.be.true;
    });

    const result = selectAppointment(store.getState(), '1');
    expect(result.version).to.equal(2);
  });

  it('should verify selectAppointments returns data', async () => {
    // Arrange
    const history = createTestHistory('/1');
    const store = createTestStore({
      featureToggles: {
        vaOnlineSchedulingUseBrowserTimezone: true,
      },
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>
        <Router history={history} path="/:id">
          {children}
        </Router>
      </Provider>
    );

    mockAppointmentsApi({
      start: subDays(new Date(), 30),
      end: addDays(new Date(), 395),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      // includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [{ id: '1', type: 'appointment', attributes: { type: 'VA' } }],
    });

    // Act
    const screen = renderHook(
      () => {
        // Always return a value so you can test results!
        return useGetAppointmentsQuery();
        // const result = useGetAppointmentsQuery();
        // console.log('result', result);
        // return result;
      },
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.result.current.isSuccess).to.be.true;
    });

    const result = selectAppointments(store.getState());
    console.log(result);
    expect(result.length).to.equal(1);
    expect(result[0].version).to.equal(2);
  });

  it('should verify selectAppointments filters out appointments that should be hidden', async () => {});

  it('should verify selectAppointmentsGroupByMonth returns data', async () => {
    // Arrange
    const store = createTestStore();
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    console.log(
      mockAppointmentsApi({
        start: subDays(new Date(), 30),
        end: addDays(new Date(), 395),
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
        // includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: [
          new MockAppointmentResponse({
            id: 3,
            localStartTime: addMonths(new Date(), 2),
          }),
          new MockAppointmentResponse({
            id: 2,
            localStartTime: addMonths(new Date(), 1),
          }),
          new MockAppointmentResponse({ id: 1, localStartTime: new Date() }),
        ],
      }),
    );

    // Act
    const screen = renderHook(
      () => {
        // Always return a value so you can test results!
        return useGetAppointmentsQuery();
        // const result = useGetAppointmentsQuery();
        // console.log('result', result);
        // return result;
      },
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.result.current.isSuccess).to.be.true;
    });

    const result = selectAppointmentsGroupByMonth(store.getState());
    expect(result[format(new Date(), 'yyyy-MM')]).to.be.ok;
    expect(result[format(addMonths(new Date(), 1), 'yyyy-MM')]).to.be.ok;
    expect(result[format(addMonths(new Date(), 2), 'yyyy-MM')]).to.be.ok;
  });

  it('should verify selectAppointmentRequest returns data', async () => {
    // Arrange
    const history = createTestHistory('/1');
    const store = createTestStore();
    const wrapper = ({ children }) => (
      <Provider store={store}>
        <Router history={history} path="/:id">
          {children}
        </Router>
      </Provider>
    );

    console.log(
      mockAppointmentApi({
        // includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: { id: '1', type: 'appointment', attributes: {} },
      }),
    );

    // Act
    const screen = renderHook(
      () => {
        // Always return a value so you can test results!
        return useGetAppointmentRequestQuery('1');
      },
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.result.current.isSuccess).to.be.true;
    });

    const result = selectAppointmentRequest(store.getState(), '1');
    expect(result.version).to.equal(2);
  });

  it('should verify selectAppointmentRequests returns data', async () => {
    // Arrange
    const history = createTestHistory('/1');
    const store = createTestStore();
    const wrapper = ({ children }) => (
      <Provider store={store}>
        <Router history={history} path="/:id">
          {children}
        </Router>
      </Provider>
    );

    console.log(
      mockAppointmentsApi({
        start: subDays(new Date(), 120),
        end: addDays(new Date(), 2),
        statuses: ['proposed', 'cancelled'],
        // includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: [{ id: '1', type: 'appointment', attributes: {} }],
      }),
    );

    // Act
    const screen = renderHook(
      () => {
        // Always return a value so you can test results!
        return useGetAppointmentRequestsQuery();
        // const result = useGetAppointmentsQuery();
        // console.log('result', result);
        // return result;
      },
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.result.current.isSuccess).to.be.true;
    });

    const result = selectAppointmentRequests(store.getState());
    expect(result.length).to.equal(1);
    expect(result[0].version).to.equal(2);
  });

  it('should verify useGetAppointmentsQuery returns data', async () => {
    // Arrange
    const store = createTestStore();
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    mockAppointmentsApi({
      start: subDays(new Date(), 30),
      end: addDays(new Date(), 395),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      response: [],
    });

    // Act
    const screen = renderHook(
      () => {
        // Always return a value so you can test results!
        return useGetAppointmentsQuery();
      },
      { wrapper },
    );
    const result = selectAppointments(store.getState());
    console.log(result);

    await waitFor(() => {
      expect(screen.result.current.isSuccess).to.be.true;
    });
    expect(screen.result.current.currentData).to.have.length(0);
  });

  it('should display success', async () => {
    // Arrange
    const store = createTestStore();

    mockAppointmentsApi({
      start: subDays(new Date(), 30),
      end: addDays(new Date(), 395),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      response: [],
    });

    // Act
    const screen = renderWithStoreAndRouter(<TestPageStub />, {
      store,
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText(/success/i)).to.be.ok;
      expect(screen.queryByText(/loading/i)).not.to.be.ok;
      expect(screen.queryByText(/error/i)).not.to.be.ok;
    });

    screen.debug();

    const selector = slice.endpoints.getAppointments.select();
    const result = selector(store.getState());
    expect(result.data.length).to.equal(0);
  });

  it('should display error', async () => {
    // Arrange
    const store = createTestStore({});
    mockAppointmentsApi({
      start: subDays(new Date(), 30),
      end: addDays(new Date(), 395),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      response: [],
    });

    mockAppointmentsApi({
      start: subDays(new Date(), 30),
      end: addDays(new Date(), 395),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      responseCode: 404,
    });

    // Act
    const screen = renderWithStoreAndRouter(<TestPageStub />, {
      store,
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText(/success/i)).not.to.be.ok;
      expect(screen.queryByText(/loading/i)).not.to.be.ok;
      expect(screen.queryByText(/error/i)).to.be.ok;
    });
  });
});
