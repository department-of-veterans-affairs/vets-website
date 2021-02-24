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
} from '../../mocks/helpers';

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
});
