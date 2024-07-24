import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import CCLayout from '../layout/CCLayout';

describe('VAOS Component: CCLayout', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingAppointmentDetailsRedesign: true,
    },
  };

  describe('When appointment information is missing', () => {
    it('should not display heading and text for empty data', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        communityCareProvider: {
          telecom: [{ system: 'phone', value: '123-456-7890' }],
          providers: [
            {
              name: {
                familyName: 'Test',
                lastName: 'User',
              },
              providerName: 'Test User',
            },
          ],
        },
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: true,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          apiData: {},
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(<CCLayout data={appointment} />, {
        store,
      });

      // Assert
      expect(screen.queryByRole('heading', { level: 2, name: /What/i })).not.to
        .exist;

      expect(screen.getByRole('heading', { level: 2, name: /Provider/ }));
      expect(screen.getByText(/Provider information not available/i));
      expect(screen.getByText(/Treatment specialty not available/i));
      expect(screen.getByText(/Address not available/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).not
        .to.exist;

      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'span' &&
            content === 'Reason: Not available'
          );
        }),
      );
      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'span' &&
            content === 'Other details: Not available'
          );
        }),
      );
    });
  });

  describe('When viewing upcomming appointment details', () => {
    it('should display CC layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        communityCareProvider: {
          address: {
            line: ['line 1'],
            city: 'City',
            state: 'State',
            postalCode: '12345',
          },
          telecom: [{ system: 'phone', value: '123-456-7890' }],
          providers: [
            {
              name: {
                familyName: 'Test',
                lastName: 'User',
              },
              providerName: 'Test User',
            },
          ],
          providerName: ['Test User'],
          treatmentSpecialty: 'Optometrist',
        },
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: true,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(<CCLayout data={appointment} />, {
        store,
      });

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Community care appointment/i,
        }),
      );
      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).to.be.ok;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByRole('heading', { level: 2, name: /Provider/ }));
      expect(screen.getByText(/Test User/i));
      expect(screen.getByText(/Optometrist/i));
      expect(screen.getByText(/line 1/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;
      const link = screen.getByRole('link', { name: /Directions/i });
      const href = link.getAttribute('href');
      const urlParams = new URLSearchParams(href);
      expect(urlParams.get('daddr')).to.be.ok;

      expect(
        screen.container.querySelector('va-telephone[contact="123-456-7890"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Details you shared with your provider/i,
        }),
      );
      expect(screen.getByText(/Reason:/i));
      expect(screen.getByText(/This is a test/i));
      expect(screen.getByText(/Other details:/i));
      expect(screen.getByText(/Additional information/i));

      expect(screen.getByText(/Need to make changes/i));

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });

  describe('When viewing past appointment details', () => {
    it('should display CC layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        communityCareProvider: {
          address: {
            line: ['line 1'],
            city: 'City',
            state: 'State',
            postalCode: 'Postal code',
          },
          telecom: [{ system: 'phone', value: '123-456-7890' }],
          providers: [
            {
              name: {
                familyName: 'Test',
                lastName: 'User',
              },
              providerName: 'Test User',
            },
          ],
          providerName: ['Test User'],
          treatmentSpecialty: 'Optometrist',
        },
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: true,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPastAppointment: true,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        start: moment()
          .subtract(1, 'day')
          .format('YYYY-MM-DDTHH:mm:ss'),
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(<CCLayout data={appointment} />, {
        store,
      });

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Past community care appointment/i,
        }),
      );
      expect(
        screen.getByRole('heading', { level: 2, name: /After visit summary/i }),
      );

      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByRole('heading', { level: 2, name: /Provider/ }));
      expect(screen.getByText(/Test User/i));
      expect(screen.getByText(/Optometrist/i));
      expect(screen.getByText(/line 1/i));
      screen.getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'span' &&
          content === 'City, State Postal code'
        );
      });

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(
        screen.container.querySelector('va-telephone[contact="123-456-7890"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Details you shared with your provider/i,
        }),
      );
      expect(screen.getByText(/Reason:/i));
      expect(screen.getByText(/This is a test/i));
      expect(screen.getByText(/Other details:/i));
      expect(screen.getByText(/Additional information/i));

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });

  describe('When viewing canceled appointment details', () => {
    it('should display CC layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        communityCareProvider: {
          address: {
            line: ['line 1'],
            city: 'City',
            state: 'State',
            postalCode: 'Postal code',
          },
          telecom: [{ system: 'phone', value: '123-456-7890' }],
          providers: [
            {
              name: {
                familyName: 'Test',
                lastName: 'User',
              },
              providerName: 'Test User',
            },
          ],
          providerName: ['Test User'],
          treatmentSpecialty: 'Optometrist',
        },
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: true,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPastAppointment: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        start: moment().format('YYYY-MM-DDTHH:mm:ss'),
        status: 'cancelled',
      };

      // Act
      const screen = renderWithStoreAndRouter(<CCLayout data={appointment} />, {
        store,
      });

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled community care appointment/i,
        }),
      );
      expect(
        screen.getByText(
          /If you want to reschedule, call us or schedule a new appointment online/i,
        ),
      );
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /After visit summary/i,
        }),
      ).not.to.exist;

      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByRole('heading', { level: 2, name: /Provider/ }));
      expect(screen.getByText(/Test User/i));
      expect(screen.getByText(/Optometrist/i));
      expect(screen.getByText(/line 1/i));
      screen.getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'span' &&
          content === 'City, State Postal code'
        );
      });

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(
        screen.container.querySelector('va-telephone[contact="123-456-7890"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Details you shared with your provider/i,
        }),
      );
      expect(screen.getByText(/Reason:/i));
      expect(screen.getByText(/This is a test/i));
      expect(screen.getByText(/Other details:/i));
      expect(screen.getByText(/Additional information/i));

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.exist;
    });
  });
});
