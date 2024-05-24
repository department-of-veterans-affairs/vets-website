/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import UpcomingAppointments from '../UpcomingAppointments';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import * as useGetUpcomingAppointmentsDataModule from '../../hooks/useGetUpcomingAppointmentsData';
import { multipleAppointments } from '../../tests/unit/mocks/mock-appointments';
import { api } from '../../api';

describe('unified check-in experience', () => {
  describe('UpcomingAppointments', () => {
    beforeEach(() => {
      setupI18n();
    });
    afterEach(() => {
      teardownI18n();
    });
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
        'Upcoming appointments',
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
          isLoading: true,
          upcomingAppointmentsDataError: false,
        });
      const screen = render(
        <CheckInProvider store={{ upcomingAppointments: [] }}>
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
          isLoading: false,
          upcomingAppointmentsDataError: true,
        });
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointments />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('upcoming-appointments-header')).to.have.text(
        'Upcoming appointments',
      );
      expect(screen.getByTestId('upcoming-appointments-error-message')).to
        .exist;

      // restore the hook
      useGetUpcomingAppointmentsDataStub.restore();
    });
    it('does fetch data if none exists', () => {
      const sandbox = sinon.createSandbox();
      const { v2 } = api;
      sandbox.stub(v2, 'getUpcomingAppointmentsData').resolves({});
      const screen = render(
        <CheckInProvider store={{ upcomingAppointments: [] }}>
          <UpcomingAppointments refresh={false} />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('upcoming-appointments-header')).to.have.text(
        'Upcoming appointments',
      );
      sandbox.assert.calledOnce(v2.getUpcomingAppointmentsData);
      sandbox.restore();
    });
    it('does not fetch data if already exists', () => {
      const sandbox = sinon.createSandbox();
      const { v2 } = api;
      sandbox.stub(v2, 'getUpcomingAppointmentsData').resolves({});
      const screen = render(
        <CheckInProvider store={{ upcomingAppointments: multipleAppointments }}>
          <UpcomingAppointments refresh={false} />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('upcoming-appointments-header')).to.have.text(
        'Upcoming appointments',
      );
      sandbox.assert.notCalled(v2.getUpcomingAppointmentsData);
      sandbox.restore();
    });
    it('should fetch data again if refresh set to true', () => {
      const sandbox = sinon.createSandbox();
      const { v2 } = api;
      sandbox.stub(v2, 'getUpcomingAppointmentsData').resolves({});
      const screen = render(
        <CheckInProvider store={{ upcomingAppointments: multipleAppointments }}>
          <UpcomingAppointments refresh />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('upcoming-appointments-header')).to.have.text(
        'Upcoming appointments',
      );
      sandbox.assert.calledOnce(v2.getUpcomingAppointmentsData);
      sandbox.restore();
    });
  });
});
