/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import format from 'date-fns/format';
import { render, fireEvent } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import UpcomingAppointmentsPage from './index';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import * as useGetUpcomingAppointmentsDataModule from '../../../hooks/useGetUpcomingAppointmentsData';
import { multipleAppointments } from '../../../tests/unit/mocks/mock-appointments';
import { api } from '../../../api';

describe('unified check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('UpcomingAppointmentsPage', () => {
    const appointmentsOn = {
      check_in_experience_upcoming_appointments_enabled: true,
    };
    it('renders regions', () => {
      const { getByTestId } = render(
        <CheckInProvider store={{ features: appointmentsOn }}>
          <UpcomingAppointmentsPage />
        </CheckInProvider>,
      );

      expect(getByTestId('upcoming-appointments-vaos')).to.exist;
      expect(getByTestId('upcoming-appointments-header')).to.exist;
      expect(getByTestId('appointments-accordions')).to.exist;
    });
    it('shows the date & time the appointments were loaded and a refresh link', () => {
      const checkIn = render(
        <CheckInProvider store={{ features: appointmentsOn }}>
          <UpcomingAppointmentsPage />
        </CheckInProvider>,
      );
      expect(checkIn.getByTestId('update-text')).to.have.text(
        `Latest update: ${format(new Date(), "MMMM d, yyyy 'at' h:mm aaaa")}`,
      );
      const refreshButton = checkIn.queryByTestId(
        'refresh-appointments-button',
      );
      expect(refreshButton).to.exist;
    });
    it('shows a privacy act modal if the link is clicked', () => {
      const checkIn = render(
        <CheckInProvider store={{ features: appointmentsOn }}>
          <UpcomingAppointmentsPage />
        </CheckInProvider>,
      );
      const privacyActLink = checkIn.getByTestId('privacy-act-statement-link');
      expect(privacyActLink).to.exist;
      privacyActLink.click();
      expect(checkIn.getByTestId('privacy-act-statement-text')).to.exist;
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
        <CheckInProvider store={{ features: appointmentsOn }}>
          <UpcomingAppointmentsPage />
        </CheckInProvider>,
      );

      expect(getByTestId('upcoming-appointments-list')).to.exist;

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
        <CheckInProvider
          store={{ upcomingAppointments: [], features: appointmentsOn }}
        >
          <UpcomingAppointmentsPage />
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
        <CheckInProvider store={{ features: appointmentsOn }}>
          <UpcomingAppointmentsPage />
        </CheckInProvider>,
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
      render(
        <CheckInProvider
          store={{ upcomingAppointments: [], features: appointmentsOn }}
        >
          <UpcomingAppointmentsPage />
        </CheckInProvider>,
      );
      sandbox.assert.calledOnce(v2.getUpcomingAppointmentsData);
      sandbox.restore();
    });
    it('does not fetch data if already exists', () => {
      const sandbox = sinon.createSandbox();
      const { v2 } = api;
      sandbox.stub(v2, 'getUpcomingAppointmentsData').resolves({});
      render(
        <CheckInProvider
          store={{
            upcomingAppointments: multipleAppointments,
            features: appointmentsOn,
          }}
        >
          <UpcomingAppointmentsPage />
        </CheckInProvider>,
      );
      sandbox.assert.notCalled(v2.getUpcomingAppointmentsData);
      sandbox.restore();
    });
    it('should fetch data again if refresh is clicked', () => {
      const sandbox = sinon.createSandbox();
      const { v2 } = api;
      sandbox.stub(v2, 'getUpcomingAppointmentsData').resolves({});
      const screen = render(
        <CheckInProvider
          store={{
            upcomingAppointments: multipleAppointments,
            features: appointmentsOn,
          }}
        >
          <UpcomingAppointmentsPage />
        </CheckInProvider>,
      );
      const refreshButton = screen.getByTestId('refresh-appointments-button');
      expect(refreshButton).to.exist;
      fireEvent.click(refreshButton);
      sandbox.assert.calledOnce(v2.getUpcomingAppointmentsData);
      sandbox.restore();
    });
  });
});
