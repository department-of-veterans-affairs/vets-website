/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import AppointmentsPage from './index';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import * as useGetCheckInDataModule from '../../../hooks/useGetCheckInData';

describe('unified check-in experience', () => {
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

      expect(getByTestId('what-next')).to.contain.text(
        'Region 1: What to do next',
      );
      expect(getByTestId('upcoming-appointments')).to.contain.text(
        'Region 2: Upcoming appointments',
      );

      // Restore the hook
      useGetCheckInDataStub.restore();
    });
    it('displays a loading component if data is loading', () => {
      // Mock the return value for the useGetCheckInData hook
      const useGetCheckInDataStub = sinon
        .stub(useGetCheckInDataModule, 'useGetCheckInData')
        .returns({
          isComplete: false,
          refreshCheckInData: () => false,
        });
      const screen = render(
        <CheckInProvider>
          <AppointmentsPage />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('loading-indicator')).to.exist;
      // restore the hook
      useGetCheckInDataStub.restore();
    });
  });
});
