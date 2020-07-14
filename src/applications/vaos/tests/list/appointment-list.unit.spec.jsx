import React from 'react';
import { Router, Route } from 'react-router';
import { expect } from 'chai';
import moment from 'moment';
import { createMemoryHistory } from 'history';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import environment from 'platform/utilities/environment';
import { setFetchJSONFailure } from 'platform/testing/unit/helpers';
import {
  getVARequestMock,
  getVideoAppointmentMock,
  getVAAppointmentMock,
  getCCAppointmentMock,
} from '../mocks/v0';
import { mockAppointmentInfo } from '../mocks/helpers';

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

  // This will change to only show when EC is available
  it('should show express care button and tab when flag is on', async () => {
    mockAppointmentInfo({});
    const initialStateWithExpressCare = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingExpressCare: true,
      },
    };
    const memoryHistory = createMemoryHistory();

    // Mocking a route here so that components using withRouter don't fail
    const { findAllByText, baseElement, getAllByRole } = renderInReduxProvider(
      <Router history={memoryHistory}>
        <Route path="/" component={AppointmentsPage} />
      </Router>,
      {
        initialState: initialStateWithExpressCare,
        reducers,
      },
    );

    const [header, button] = await findAllByText(
      'Request an Express Care screening',
    );

    expect(baseElement).to.contain.text(
      'window for Express Care requests is 00:00 to 00:00',
    );
    expect(header).to.have.tagName('h2');
    expect(button).to.have.attribute(
      'href',
      'https://veteran.apps-staging.va.gov/var/v4/#new-express-request',
    );
    expect(getAllByRole('tab')[2]).to.contain.text('Express care');
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
    const { findByText, queryByText, getAllByRole } = renderInReduxProvider(
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
  });
});
