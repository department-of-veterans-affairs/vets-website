import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import reducers from '../../reducers';
import { getVideoAppointmentMock } from '../mocks/v0';
import { mockPastAppointmentInfo } from '../mocks/helpers';

import PastAppointmentsList from '../../components/PastAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingPast: true,
  },
};

describe('VAOS integration: past appointments', () => {
  it('should show expected video information', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: moment()
        .add(-3, 'days')
        .format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: moment()
        .add(-3, 'days')
        .format(),
      bookingNotes: 'Some random note',
      status: { description: 'C', code: 'CHECKED OUT' },
    };
    mockFetch();
    mockPastAppointmentInfo({ va: [appointment] });

    const { findByText, baseElement, queryByText } = renderInReduxProvider(
      <PastAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    const dateHeader = await findByText(
      new RegExp(
        moment()
          .add(-3, 'days')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Video Connect');

    expect(dateHeader).to.have.tagName('h3');
    expect(baseElement).not.to.contain.text('Some random note');
    expect(queryByText(/video conference/i)).to.exist;
    expect(queryByText(/add to calendar/i)).to.not.exist;
    expect(queryByText(/cancel appointment/i)).to.not.exist;
    resetFetch();
  });
});
