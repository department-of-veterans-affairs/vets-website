import React from 'react';
import { Router, Route } from 'react-router';
import { expect } from 'chai';
import moment from 'moment';
import { createMemoryHistory } from 'history';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import environment from 'platform/utilities/environment';
import {
  setFetchJSONFailure,
  mockFetch,
  resetFetch,
} from 'platform/testing/unit/helpers';
import {
  getVARequestMock,
  getVideoAppointmentMock,
  getVAAppointmentMock,
  getCCAppointmentMock,
  getExpressCareRequestCriteriaMock,
} from '../mocks/v0';
import {
  mockAppointmentInfo,
  mockRequestEligibilityCriteria,
} from '../mocks/helpers';

import reducers from '../../reducers';
import FutureAppointmentsList from '../../components/FutureAppointmentsList';
import AppointmentsPage from '../../containers/AppointmentsPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
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

    const { baseElement, findAllByRole } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
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

    const { baseElement, findAllByRole } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
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
  });

  it('should show no appointments message when there are no appointments', () => {
    mockAppointmentInfo({});

    const { findByText } = renderInReduxProvider(<FutureAppointmentsList />, {
      initialState,
      reducers,
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
          .add(13, 'months')
          .startOf('day')
          .toISOString()}&type=va`,
      ),
      { errors: [] },
    );

    const { baseElement, findByText } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
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

  it('should show express care button and tab when flag is on and within express care window', async () => {
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
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCare: true,
      },
      user: userState,
    };
    const memoryHistory = createMemoryHistory();

    // Mocking a route here so that components using withRouter don't fail
    const {
      findByText,
      baseElement,
      getAllByRole,
      getByText,
    } = renderInReduxProvider(
      <Router history={memoryHistory}>
        <Route path="/" component={AppointmentsPage} />
      </Router>,
      {
        initialState: initialStateWithExpressCare,
        reducers,
      },
    );

    const header = await findByText('Create a new Express Care request');
    const button = await findByText('Create an Express Care request');

    expect(baseElement).to.contain.text(
      'Talk to VA health care staff today about a condition',
    );
    expect(header).to.have.tagName('h2');
    expect(button).to.have.attribute(
      'href',
      'https://veteran.apps-staging.va.gov/var/v4/#new-express-request',
    );
    expect(getAllByRole('tab').length).to.equal(3);
    expect(getByText('Upcoming')).to.have.attribute('role', 'tab');
    expect(getByText('Past')).to.have.attribute('role', 'tab');
    expect(getByText('Express Care')).to.have.attribute('role', 'tab');
    expect(
      getByText(/View your upcoming, past, and Express Care appointments/i),
    ).to.have.tagName('h2');
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
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCare: true,
      },
      user: userState,
    };
    const memoryHistory = createMemoryHistory();

    // Mocking a route here so that components using withRouter don't fail
    const { findByText, getByText } = renderInReduxProvider(
      <Router history={memoryHistory}>
        <Route path="/" component={AppointmentsPage} />
      </Router>,
      {
        initialState: initialStateWithExpressCare,
        reducers,
      },
    );

    await findByText(/Express Care isn’t available right now/i);
    expect(getByText(/create an express care request/i)).to.have.attribute(
      'disabled',
    );
  });

  it('should not show express care action or tab when flag is off', async () => {
    mockAppointmentInfo({});
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCare: false,
      },
    };
    const memoryHistory = createMemoryHistory();

    // Mocking a route here so that components using withRouter don't fail
    const {
      findByText,
      queryByText,
      getAllByRole,
      getByText,
    } = renderInReduxProvider(
      <Router history={memoryHistory}>
        <Route path="/" component={AppointmentsPage} />
      </Router>,
      {
        initialState: initialStateWithExpressCare,
        reducers,
      },
    );

    await findByText('Create a new appointment');
    expect(queryByText(/request an express care screening/i)).to.not.be.ok;
    expect(getAllByRole('tab').length).to.equal(2);
    expect(getByText('Upcoming appointments')).to.have.attribute('role', 'tab');
    expect(getByText('Past appointments')).to.have.attribute('role', 'tab');
    expect(
      queryByText(/View your upcoming, past, and Express Care appointments/i),
    ).not.to.exist;
  });

  it('should show express care action but not tab when flag is on and no requests', async () => {
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
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCare: true,
      },
      user: userState,
    };
    const memoryHistory = createMemoryHistory();

    // Mocking a route here so that components using withRouter don't fail
    const {
      findByText,
      getAllByRole,
      getByText,
      findAllByText,
      queryByText,
    } = renderInReduxProvider(
      <Router history={memoryHistory}>
        <Route path="/" component={AppointmentsPage} />
      </Router>,
      {
        initialState: initialStateWithExpressCare,
        reducers,
      },
    );

    await findByText('Create a new appointment');
    expect(await findAllByText('Create a new Express Care request')).to.be.ok;
    expect(getAllByRole('tab').length).to.equal(2);
    expect(getByText('Upcoming appointments')).to.have.attribute('role', 'tab');
    expect(getByText('Past appointments')).to.have.attribute('role', 'tab');
    expect(
      queryByText(/View your upcoming, past, and Express Care appointments/i),
    ).not.to.exist;
  });
});
