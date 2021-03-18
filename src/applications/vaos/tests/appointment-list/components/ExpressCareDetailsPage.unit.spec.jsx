import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import userEvent from '@testing-library/user-event';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import {
  getTimezoneTestDate,
  renderWithStoreAndRouter,
} from '../../mocks/setup';
import { getVARequestMock } from '../../mocks/v0';
import { AppointmentList } from '../../../appointment-list';
import {
  mockAppointmentInfo,
  mockPastAppointmentInfo,
  mockRequestCancelFetch,
  mockSingleRequestFetch,
} from '../../mocks/helpers';
import { waitFor } from '@testing-library/dom';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

describe('VAOS <ExpressCareDetailsPage>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });

  it('should render submitted Express Care request details', async () => {
    const request = getVARequestMock();
    const startDate = moment();
    request.attributes = {
      ...request.attributes,
      typeOfCareId: 'CR1',
      status: 'Submitted',
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      reasonForVisit: 'Back pain',
      additionalInformation: 'Need help ASAP',
      date: startDate.format(),
    };
    request.id = '1234';
    mockSingleRequestFetch({ request });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/express-care/${request.id}`,
    });

    // Verify document title
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Express Care request on ${moment(request.attributes.date).format(
          'dddd, MMMM D, YYYY',
        )}`,
      );
    });

    // verify h1 heading exists
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: moment(request.attributes.date).format('dddd, MMMM D, YYYY'),
      }),
    );

    // verify focus is on h1
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    // verify page content...
    expect(screen.getByText('Back pain')).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      startDate.format('dddd, MMMM D, YYYY'),
    );
    expect(screen.baseElement).to.contain.text('Express Care request');
    expect(screen.baseElement).to.contain.text(
      'A VA health care provider will contact you today about your request.',
    );
    expect(screen.baseElement).to.contain.text('Need help ASAP');

    expect(screen.baseElement).to.contain.text('patient.test@va.gov');
    expect(screen.baseElement).to.contain.text('5555555566');

    expect(screen.getByRole('button', { name: 'Cancel Express Care request' }))
      .to.be.ok;
  });

  it('should render escalated Express Care request details', async () => {
    const appointment = getVARequestMock();
    const startDate = moment();
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: 'CR1',
      status: 'Escalated',
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      reasonForVisit: 'Back pain',
      additionalInformation: 'Need help ASAP',
      date: startDate.format(),
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });
    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    userEvent.click(detailLinks[0]);

    expect(await screen.findByText('Back pain')).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      startDate.format('dddd, MMMM D, YYYY'),
    );
    expect(screen.baseElement).to.contain.text('Express Care request');
    expect(screen.baseElement).to.contain.text(
      'A VA health care provider will contact you today about your request.',
    );
    expect(screen.baseElement).to.contain.text('Need help ASAP');

    expect(screen.baseElement).to.contain.text('patient.test@va.gov');
    expect(screen.baseElement).to.contain.text('5555555566');

    expect(
      screen.queryByRole('button', { name: 'Cancel Express Care request' }),
    ).not.to.be.ok;
  });

  it('should render cancelled by veteran Express Care request details', async () => {
    const appointment = getVARequestMock();
    const startDate = moment();
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: 'CR1',
      status: 'Cancelled',
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      reasonForVisit: 'Back pain',
      additionalInformation: 'Need help ASAP',
      date: startDate.format(),
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });
    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    userEvent.click(detailLinks[0]);

    expect(await screen.findByText('Back pain')).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      startDate.format('dddd, MMMM D, YYYY'),
    );
    expect(screen.baseElement).to.contain.text(
      'This screening has been canceled',
    );
    expect(screen.baseElement).to.contain.text(
      'If you still want to use Express Care, please submit another request tomorrow.',
    );
    expect(screen.baseElement).not.to.contain.text(
      'We tried to call you, but couldn’t reach you by phone',
    );
    expect(
      screen.queryByRole('button', { name: 'Cancel Express Care request' }),
    ).not.to.be.ok;
  });

  it('should render unable to reach veteran Express Care request details', async () => {
    const appointment = getVARequestMock();
    const startDate = moment();
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: 'CR1',
      status: 'Cancelled',
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      reasonForVisit: 'Back pain',
      additionalInformation: 'Need help ASAP',
      date: startDate.format(),
      appointmentRequestDetailCode: [
        {
          detailCode: {
            code: 'DETCODE23',
          },
        },
      ],
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });
    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    userEvent.click(detailLinks[0]);

    expect(await screen.findByText('Back pain')).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      startDate.format('dddd, MMMM D, YYYY'),
    );
    expect(screen.baseElement).to.contain.text(
      'This screening has been canceled',
    );
    expect(screen.baseElement).to.contain.text(
      'If you still want to use Express Care, please submit another request tomorrow.',
    );
    expect(screen.baseElement).to.contain.text(
      'We tried to call you, but couldn’t reach you by phone',
    );
    expect(
      screen.queryByRole('button', { name: 'Cancel Express Care request' }),
    ).not.to.be.ok;
  });

  it('should render completed Express Care request details', async () => {
    const appointment = getVARequestMock();
    const startDate = moment().subtract(3, 'days');
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: 'CR1',
      status: 'Resolved',
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      reasonForVisit: 'Back pain',
      additionalInformation: 'Need help ASAP',
      date: startDate.format(),
    };
    appointment.id = '1234';
    mockPastAppointmentInfo({
      requests: [appointment],
    });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/past',
    });
    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    userEvent.click(detailLinks[0]);

    expect(await screen.findByText('Back pain')).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      startDate.format('dddd, MMMM D, YYYY'),
    );

    expect(screen.baseElement).to.contain.text('Express Care request');
    expect(screen.baseElement).to.contain.text(
      'We’ve completed your screening. Thank you for using Express Care.',
    );

    expect(
      screen.queryByRole('button', { name: 'Cancel Express Care request' }),
    ).not.to.be.ok;
  });

  it('should allow cancellation', async () => {
    const appointment = getVARequestMock();
    const startDate = moment();
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: 'CR1',
      status: 'Submitted',
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      reasonForVisit: 'Back pain',
      additionalInformation: 'Need help ASAP',
      date: startDate.format(),
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });

    mockRequestCancelFetch(appointment);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });

    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    userEvent.click(detailLinks[0]);

    expect(await screen.findByText('Back pain')).to.be.ok;

    expect(screen.baseElement).not.to.contain.text('canceled');

    userEvent.click(screen.getByText(/cancel express care request/i));

    await screen.findByRole('alertdialog');

    userEvent.click(screen.getByText(/yes, cancel this request/i));

    await screen.findByText(/your request has been canceled/i);

    const cancelData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].endsWith('appointment_requests/1234'))
        .args[1].body,
    );

    expect(cancelData).to.deep.equal({
      ...appointment.attributes,
      id: '1234',
      appointmentRequestDetailCode: ['DETCODE8'],
      status: 'Cancelled',
    });

    userEvent.click(screen.getByText(/continue/i));

    expect(screen.queryByRole('alertdialog')).to.not.be.ok;
    expect(screen.baseElement).to.contain.text(
      'This screening has been canceled.',
    );
  });

  it('should render error message if fetch fails', async () => {
    const request = getVARequestMock();
    request.attributes = {
      ...request.attributes,
      typeOfCareId: 'CR1',
      status: 'Submitted',
    };
    request.id = '1234';
    mockSingleRequestFetch({ request, error: true });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/express-care/${request.id}`,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'We’re sorry. We’ve run into a problem',
      }),
    ).to.be.ok;
  });
});
