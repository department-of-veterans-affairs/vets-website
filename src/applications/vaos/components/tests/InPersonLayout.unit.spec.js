import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import InPersonLayout from '../layout/InPersonLayout';

describe('VAOS Component: InPersonLayout', () => {
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
      vaOnlineSchedulingAppointmentDetailsRedesign: true,
    },
  };

  describe('When viewing upcoming appointment details', () => {
    it('should display in-person layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isCancellable: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <InPersonLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /In-person appointment/i,
        }),
      );
      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).to.be.ok;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Primary care/i));

      expect(
        screen.getByRole('heading', { level: 2, name: /Where to attend/i }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(/Location:/i));
      expect(screen.getByText(/CHEYENNE/));

      expect(screen.getByText(/Clinic:/i));
      expect(screen.getByText(/Clinic 1/i));
      expect(screen.getByText(/Clinic phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
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

      expect(screen.container.querySelector('va-button[text="Print"]'));
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).to.be.ok;
    });
    it('should display in-person layout without cancel button', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isCancellable: false,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <InPersonLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /In-person appointment/i,
        }),
      );
      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).to.be.ok;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Primary care/i));

      expect(
        screen.getByRole('heading', { level: 2, name: /Where to attend/i }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(/Location:/i));
      expect(screen.getByText(/CHEYENNE/));

      expect(screen.getByText(/Clinic:/i));
      expect(screen.getByText(/Clinic 1/i));
      expect(screen.getByText(/Clinic phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
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

      expect(screen.container.querySelector('va-button[text="Print"]'));
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });

    it('should display default text for empty data', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          apiData: {},
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <InPersonLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Type of care information not available/i));

      expect(
        screen.getByRole('heading', { level: 2, name: /Where to attend/i }),
      );
      expect(screen.getByText(/Facility details not available/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).not
        .to.exist;
      expect(
        screen.getByRole('link', {
          name: /Find facility information Link opens in a new tab/i,
        }),
      );

      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'span' &&
            content === 'Location: Not available'
          );
        }),
      );
      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'span' &&
            content === 'Clinic: Not available'
          );
        }),
      );
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

  describe('When viewing past appointment details', () => {
    it('should display in-person layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {},
        vaos: {
          isPastAppointment: true,
          isCancellable: true,
          apiData: {
            localStartTime: moment()
              .subtract(1, 'day')
              .format('YYYY-MM-DDTHH:mm:ss'),
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <InPersonLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Past in-person appointment/i,
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

      expect(screen.getByRole('heading', { level: 2, name: /Where/i }));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(/Location:/i));
      expect(screen.getByText(/CHEYENNE/));

      expect(screen.getByText(/Clinic:/i));
      expect(screen.getByText(/Clinic 1/i));
      expect(screen.getByText(/Clinic phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
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
    it('should display in-person layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {},
        vaos: {
          isUpcomingAppointment: true,
          apiData: {
            localStartTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
            serviceType: 'primaryCare',
          },
        },
        status: 'cancelled',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <InPersonLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled in-person appointment/i,
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

      expect(screen.getByRole('heading', { level: 2, name: /Where/i }));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(/Location:/i));
      expect(screen.getByText(/CHEYENNE/));

      expect(screen.getByText(/Clinic:/i));
      expect(screen.getByText(/Clinic 1/i));
      expect(screen.getByText(/Clinic phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
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
