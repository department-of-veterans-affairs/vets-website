import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { merge } from 'lodash/fp';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import reducers from '../../reducers';
import singleVAAppointment from '../mocks/single-va-appointment.json';
import singleVAFacility from '../mocks/single-va-facility.json';
import { mockAppointmentInfo, mockFacilitesFetch } from '../mocks/helpers';

import FutureAppointmentsList from '../../components/FutureAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS integration: upcoming VA appointments', () => {
  it('should show information without facility details', async () => {
    const appointment = merge(singleVAAppointment, {
      attributes: {
        startDate: moment().format(),
        clinicFriendlyName: 'C&P BEV AUDIO FTC1',
        facilityId: '983',
        sta6aid: '983GC',
        vdsAppointments: [
          {
            bookingNote: 'Some random note',
            currentStatus: 'FUTURE',
          },
        ],
      },
    });

    mockAppointmentInfo({ va: [appointment] });
    const {
      findByText,
      baseElement,
      getByText,
      queryByText,
    } = renderInReduxProvider(<FutureAppointmentsList />, {
      initialState,
      reducers,
    });

    const dateHeader = await findByText(
      new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Appointment');
    expect(baseElement).to.contain.text('Confirmed');
    expect(baseElement).to.contain('.fa-check-circle');

    expect(dateHeader).to.have.tagName('h3');
    expect(getByText(/view facility information/i)).to.have.attribute(
      'href',
      '/find-locations/facility/vha_442GC',
    );
    expect(baseElement).not.to.contain.text('Some random note');
    expect(getByText(/add to calendar/i)).to.have.tagName('a');
    expect(getByText(/cancel appointment/i)).to.have.tagName('button');
  });

  it('should show information with facility details', async () => {
    const appointment = merge(singleVAAppointment, {
      attributes: {
        startDate: moment().format(),
        clinicFriendlyName: 'C&P BEV AUDIO FTC1',
        facilityId: '983',
        sta6aid: '983GC',
        vdsAppointments: [
          {
            currentStatus: 'FUTURE',
          },
        ],
      },
    });
    mockAppointmentInfo({ va: [appointment] });
    const facility = merge(singleVAFacility, {
      id: 'vha_442GC',
      attributes: {
        uniqueId: '442GC',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
          },
        },
        phone: {
          main: '307-778-7550',
        },
      },
    });
    mockFacilitesFetch('vha_442GC', [facility]);
    const { findByText, baseElement, getByText } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    await findByText(new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'));

    expect(getByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(baseElement).to.contain.text('C&P BEV AUDIO FTC1');
    expect(baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(baseElement).to.contain.text('307-778-7550');
  });

  it('should show comment for self-scheduled appointments', async () => {
    const appointment = merge(singleVAAppointment, {
      attributes: {
        startDate: moment().format(),
        vdsAppointments: [
          {
            bookingNote: 'Follow-up/Routine: Instructions',
            currentStatus: 'FUTURE',
          },
        ],
      },
    });
    mockAppointmentInfo({ va: [appointment] });
    const { findByText, baseElement } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    await findByText(new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'));

    expect(baseElement).to.contain.text('Follow-up/Routine');
    expect(baseElement).to.contain.text('Instructions');
  });

  it('should have correct status when previously cancelled', async () => {
    const appointment = merge(singleVAAppointment, {
      attributes: {
        startDate: moment().format(),
        vdsAppointments: [
          {
            currentStatus: 'CANCELLED BY CLINIC',
          },
        ],
      },
    });
    mockAppointmentInfo({ va: [appointment] });
    const { findByText, baseElement } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    await findByText(new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'));

    expect(baseElement).to.contain.text('Canceled');
    expect(baseElement).to.contain('.fa-exclamation-circle');
    expect(baseElement).not.to.contain.text('Add to calendar');
    expect(baseElement).not.to.contain.text('Cancel appointment');
  });

  it('should not display when they have hidden statuses', () => {
    const appointment = merge(singleVAAppointment, {
      attributes: {
        startDate: moment().format(),
        vdsAppointments: [
          {
            currentStatus: 'NO-SHOW',
          },
        ],
      },
    });

    mockAppointmentInfo({ va: [appointment] });
    const { findByText } = renderInReduxProvider(<FutureAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(findByText(/You don’t have any appointments/i)).to.eventually
      .be.ok;
  });

  it('should not display when over 13 months away', () => {
    const appointment = merge(singleVAAppointment, {
      attributes: {
        startDate: moment()
          .add(14, 'months')
          .format(),
        vdsAppointments: [
          {
            currentStatus: 'FUTURE',
          },
        ],
      },
    });

    mockAppointmentInfo({ va: [appointment] });
    const { findByText } = renderInReduxProvider(<FutureAppointmentsList />, {
      initialState,
      reducers,
    });

    return expect(findByText(/You don’t have any appointments/i)).to.eventually
      .be.ok;
  });
});
