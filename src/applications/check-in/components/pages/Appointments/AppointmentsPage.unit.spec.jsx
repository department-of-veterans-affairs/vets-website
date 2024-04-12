/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import AppointmentsPage from './index';
import UpcomingAppointments from '../../UpcomingAppointments';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import * as useGetCheckInDataModule from '../../../hooks/useGetCheckInData';

describe('unified check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('AppointmentsPage', () => {
    it('renders regions', () => {
      // Mock the return value for the useGetCheckInData hook
      const useGetCheckInDataStub = sinon
        .stub(useGetCheckInDataModule, 'useGetCheckInData')
        .returns({
          isComplete: true,
        });

      const { getByTestId } = render(
        <CheckInProvider>
          <AppointmentsPage />
        </CheckInProvider>,
      );

      expect(getByTestId('upcoming-appointments')).to.exist;
      expect(UpcomingAppointments).to.exist;

      // Restore the hook
      useGetCheckInDataStub.restore();
    });
    it('displays a loading component if data is loading', () => {
      // Mock the return value for the useGetCheckInData hook
      const useGetCheckInDataStub = sinon
        .stub(useGetCheckInDataModule, 'useGetCheckInData')
        .returns({
          isComplete: false,
          isLoading: true,
        });
      const screen = render(
        <CheckInProvider store={{ appointments: [] }}>
          <AppointmentsPage />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('loading-indicator')).to.exist;
      // restore the hook
      useGetCheckInDataStub.restore();
    });
  });
});
