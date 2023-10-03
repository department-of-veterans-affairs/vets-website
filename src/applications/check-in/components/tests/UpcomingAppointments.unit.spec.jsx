/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import UpcomingAppointments from '../UpcomingAppointments';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import * as useGetUpcomingAppointmentsDataModule from '../../hooks/useGetUpcomingAppointmentsData';

describe('unified check-in experience', () => {
  describe('UpcomingAppointments', () => {
    it('displays the upcoming appointments list component', () => {
      // Mock the return value for the useGetUpcomingAppointmentsData hook
      const useGetUpcomingAppointmentsDataStub = sinon
        .stub(
          useGetUpcomingAppointmentsDataModule,
          'useGetUpcomingAppointmentsData',
        )
        .returns({
          isComplete: true,
        });

      const { getByTestId } = render(
        <CheckInProvider>
          <UpcomingAppointments />
        </CheckInProvider>,
      );

      expect(getByTestId('upcoming-appointments-header')).to.have.text(
        'Upcoming Appointments',
      );

      // Restore the hook
      useGetUpcomingAppointmentsDataStub.restore();
    });
    it('displays a loading component if data is loading', () => {
      // Mock the return value for the useGetUpcomingAppointmentsData hook
      const useGetUpcomingAppointmentsDataStub = sinon
        .stub(
          useGetUpcomingAppointmentsDataModule,
          'useGetUpcomingAppointmentsData',
        )
        .returns({
          isComplete: false,
          upcomingAppointmentsDataError: false,
        });
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointments />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('loading-indicator')).to.exist;
      // restore the hook
      useGetUpcomingAppointmentsDataStub.restore();
    });
    it('displays a error message if there is a problem fetching upcoming appointments', () => {
      // Mock the return value for the useGetUpcomingAppointmentsData hook
      const useGetUpcomingAppointmentsDataStub = sinon
        .stub(
          useGetUpcomingAppointmentsDataModule,
          'useGetUpcomingAppointmentsData',
        )
        .returns({
          isComplete: true,
          upcomingAppointmentsDataError: true,
        });
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointments />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('upcoming-appointments-header')).to.have.text(
        'Upcoming Appointments',
      );
      expect(
        screen.getByTestId('upcoming-appointments-error-message'),
      ).to.have.text('There was an error retreiving upcoming appointments');

      // restore the hook
      useGetUpcomingAppointmentsDataStub.restore();
    });
  });
});
