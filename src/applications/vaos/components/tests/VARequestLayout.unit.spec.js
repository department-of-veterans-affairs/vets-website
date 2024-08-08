import React from 'react';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import VARequestLayout from '../layout/VARequestLayout';

describe('VAOS Component: VARequestLayout', () => {
  const initialState = {
    appointments: {
      facilityData: {
        '983': {
          address: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
          name: 'Cheyenne VA Medical Center',
          telecom: [
            {
              system: 'phone',
              value: '307-778-7550',
            },
          ],
        },
      },
    },
    featureToggles: {
      vaOnlineSchedulingAfterVisitSummary: true,
      vaOnlineSchedulingAppointmentDetailsRedesign: true,
    },
  };

  describe('When viewing request details page', () => {
    it('should display VA request layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        contact: {
          telecom: [
            {
              type: 'email',
              value: 'user@va.gov',
            },
            {
              type: 'phone',
              value: '1234567890',
            },
          ],
        },
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        preferredDates: [],
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: true,
          isUpcomingAppointment: false,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'proposed',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VARequestLayout data={appointment} />,
        {
          store,
        },
      );
      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Request for appointment/i,
        }),
      );
      expect(
        screen.getByText(
          /We.ll try to schedule your appointment in the next 2 business days/i,
        ),
      );
      expect(
        screen.container.querySelector(
          'va-link[text="Review your appointments"]',
        ),
      ).to.be.null;
      expect(
        screen.container.querySelector(
          'va-link[text="Schedule a new appointment"]',
        ),
      ).to.be.null;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Preferred date and time/i,
        }),
      );

      expect(screen.getByRole('heading', { level: 2, name: /Type of care/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByText(/How you prefer to attend/i));

      expect(screen.getByRole('heading', { level: 2, name: /Facility/i }));
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByRole('heading', { level: 2, name: /Phone/i }));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Details you.d like to share with your provider/i,
        }),
      );
      expect(screen.getByText(/Reason:/i));
      expect(screen.getByText(/This is a test/i));
      expect(screen.getByText(/Other details:/i));
      expect(screen.getByText(/Additional information/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Your contact details/i,
        }),
      );
      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'span' &&
            content === 'Email: user@va.gov'
          );
        }),
      );
      expect(screen.getByText(/Phone number/));
      expect(
        screen.container.querySelector('va-telephone[contact="1234567890"]'),
      ).to.be.ok;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(screen.container.querySelector('va-button[text="Cancel request"]'))
        .to.be.ok;
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /After visit summary/i,
        }),
      ).to.be.null;
    });
  });

  describe('When viewing canceled appointment details', () => {
    it('should display VA request layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        contact: {
          telecom: [
            {
              type: 'email',
              value: 'user@va.gov',
            },
            {
              type: 'phone',
              value: '1234567890',
            },
          ],
        },
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        preferredDates: [],
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: true,
          isUpcomingAppointment: false,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'cancelled',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VARequestLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled request for appointment/i,
        }),
      );
      expect(
        screen.container.querySelector(
          'va-link[text="Schedule a new appointment"]',
        ),
      ).to.be.ok;
      expect(screen.getByText(/Facility canceled this appointment/i));
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Preferred date and time/i,
        }),
      );

      expect(screen.getByRole('heading', { level: 2, name: /Type of care/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByText(/How you prefer to attend/i));

      expect(screen.getByRole('heading', { level: 2, name: /Facility/i }));
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByRole('heading', { level: 2, name: /Phone/i }));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Details you.d like to share with your provider/i,
        }),
      );
      expect(screen.getByText(/Reason:/i));
      expect(screen.getByText(/This is a test/i));
      expect(screen.getByText(/Other details:/i));
      expect(screen.getByText(/Additional information/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Your contact details/i,
        }),
      );
      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'span' &&
            content === 'Email: user@va.gov'
          );
        }),
      );
      expect(screen.getByText(/Phone number/));
      expect(
        screen.container.querySelector('va-telephone[contact="1234567890"]'),
      ).to.be.ok;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(screen.container.querySelector('va-button[text="Cancel request"]'))
        .not.to.exist;
    });
  });

  describe('When scheduling an appointment request', () => {
    it('should display VA request layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        contact: {
          telecom: [
            {
              type: 'email',
              value: 'user@va.gov',
            },
            {
              type: 'phone',
              value: '1234567890',
            },
          ],
        },
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        preferredDates: [],
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: true,
          isUpcomingAppointment: false,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'proposed',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VARequestLayout data={appointment} />,
        {
          store,
          path: '/?confirmMsg=true',
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /We have received your request/i,
        }),
      );
      expect(
        screen.getByText(
          /We.ll try to schedule your appointment in the next 2 business days/i,
        ),
      );
      expect(
        screen.container.querySelector(
          'va-link[text="Review your appointments"]',
        ),
      ).to.be.ok;
      expect(
        screen.container.querySelector(
          'va-link[text="Schedule a new appointment"]',
        ),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Preferred date and time/i,
        }),
      );

      expect(screen.getByRole('heading', { level: 2, name: /Type of care/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByText(/How you prefer to attend/i));

      expect(screen.getByRole('heading', { level: 2, name: /Facility/i }));
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByRole('heading', { level: 2, name: /Phone/i }));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Details you.d like to share with your provider/i,
        }),
      );
      expect(screen.getByText(/Reason:/i));
      expect(screen.getByText(/This is a test/i));
      expect(screen.getByText(/Other details:/i));
      expect(screen.getByText(/Additional information/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Your contact details/i,
        }),
      );
      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'span' &&
            content === 'Email: user@va.gov'
          );
        }),
      );
      expect(screen.getByText(/Phone number/));
      expect(
        screen.container.querySelector('va-telephone[contact="1234567890"]'),
      ).to.be.ok;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(screen.container.querySelector('va-button[text="Cancel request"]'))
        .to.be.ok;
    });
  });
});
