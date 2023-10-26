import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import { multipleAppointments } from '../../tests/unit/mocks/mock-appointments';
import UpcomingAppointmentsList from '../UpcomingAppointmentsList';

describe('unified check-in experience', () => {
  describe('UpcomingAppointmentsList', () => {
    it('displays the upcoming appointments list item components separated by month year dividers', () => {
      const { getByTestId, getAllByTestId } = render(
        <CheckInProvider>
          <UpcomingAppointmentsList
            upcomingAppointments={multipleAppointments}
          />
        </CheckInProvider>,
      );
      expect(getByTestId('appointments-list-monthyear-heading')).to.exist;
      expect(getByTestId('appointment-list')).to.exist;
      expect(getAllByTestId('appointment-list-item').length).to.equal(3);
    });
    it('displays the no upcoming appointments info message when there are no appointments', () => {
      const { getByTestId } = render(
        <CheckInProvider upcomingAppointments={[]}>
          <UpcomingAppointmentsList />
        </CheckInProvider>,
      );

      expect(getByTestId('no-upcoming-appointments')).to.exist;
    });
  });
});
