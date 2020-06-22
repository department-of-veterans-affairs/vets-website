import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import set from 'platform/utilities/data/set';
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

describe('VAOS appointment list future booked', () => {
  describe('va appointments', () => {
    it('should show information without facility details', async () => {
      const appointment = set(
        'attributes.startDate',
        moment()
          .add(3, 'days')
          .format(),
        singleVAAppointment,
      );
      mockAppointmentInfo({ va: [appointment] });
      const { findByText, baseElement, getByText } = renderInReduxProvider(
        <FutureAppointmentsList />,
        {
          initialState,
          reducers,
        },
      );

      const dateHeader = await findByText(
        new RegExp(
          moment()
            .add(3, 'days')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      );

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
      const appointment = set(
        'attributes.startDate',
        moment()
          .add(3, 'days')
          .format(),
        singleVAAppointment,
      );
      mockAppointmentInfo({ va: [appointment] });
      mockFacilitesFetch('vha_442GC', [singleVAFacility]);
      const { findByText, baseElement, getByText } = renderInReduxProvider(
        <FutureAppointmentsList />,
        {
          initialState,
          reducers,
        },
      );

      const dateHeader = await findByText(
        new RegExp(
          moment()
            .add(3, 'days')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      );

      expect(baseElement).to.contain.text('Confirmed');
      expect(baseElement).to.contain('.fa-check-circle');

      expect(dateHeader).to.have.tagName('h3');
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
      let appointment = set(
        'attributes.startDate',
        moment()
          .add(3, 'days')
          .format(),
        singleVAAppointment,
      );
      // Self-scheduled appointments have a booking note with our purpose text at the start
      appointment = set(
        'attributes.vdsAppointments[0].bookingNote',
        'Follow-up/Routine: Instructions',
        appointment,
      );
      mockAppointmentInfo({ va: [appointment] });
      const { findByText, baseElement } = renderInReduxProvider(
        <FutureAppointmentsList />,
        {
          initialState,
          reducers,
        },
      );

      await findByText(
        new RegExp(
          moment()
            .add(3, 'days')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      );

      expect(baseElement).to.contain.text('Follow-up/Routine');
      expect(baseElement).to.contain.text('Instructions');
    });
    it('should have correct status when previously cancelled', async () => {
      let appointment = set(
        'attributes.startDate',
        moment()
          .add(3, 'days')
          .format(),
        singleVAAppointment,
      );
      appointment = set(
        'attributes.vdsAppointments[0].currentStatus',
        'CANCELLED BY CLINIC',
        appointment,
      );
      mockAppointmentInfo({ va: [appointment] });
      const { findByText, baseElement } = renderInReduxProvider(
        <FutureAppointmentsList />,
        {
          initialState,
          reducers,
        },
      );

      await findByText(
        new RegExp(
          moment()
            .add(3, 'days')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      );

      expect(baseElement).to.contain.text('Canceled');
      expect(baseElement).to.contain('.fa-exclamation-circle');
      expect(baseElement).not.to.contain.text('Add to calendar');
      expect(baseElement).not.to.contain.text('Cancel appointment');
    });
  });
});
