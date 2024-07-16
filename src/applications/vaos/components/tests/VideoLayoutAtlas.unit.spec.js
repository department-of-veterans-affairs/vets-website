import React from 'react';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import VideoLayoutAtlas from '../layout/VideoLayoutAtlas';
import { VIDEO_TYPES } from '../../utils/constants';

describe('VAOS Component: VideoLayoutAtlas', () => {
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

  describe('When appointment information is missing', () => {
    it('should not display heading and text for empty data', async () => {
      // Arrange
      const state = {
        ...initialState,
        appointments: {
          facilityData: {},
        },
      };

      const store = createTestStore(state);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
        },
        videoData: {
          atlasConfirmationCode: '1234',
          atlasLocation: {
            address: {
              line: ['5929 Georgia Ave NW'],
              city: 'Washington',
              state: 'DC',
              postalCode: '20011',
            },
          },
          isVideo: true,
          facilityId: '983',
          isAtlas: true,
          kind: VIDEO_TYPES.adhoc,
          extension: {
            patientHasMobileGfe: false,
          },
        },
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isVideo: true,
          apiData: {},
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VideoLayoutAtlas data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Video appointment at an Atlas location/i,
        }),
      );

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /Who/i,
        }),
      ).not.to.exist;

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /What/i,
        }),
      ).not.to.exist;

      expect(
        screen.queryByRole('heading', { level: 2, name: /Where to attend/i }),
      ).not.to.exist;

      expect(screen.getByText(/Clinic not available/i));
      expect(screen.getByText(/Facility not available/i));
    });
  });

  describe('When viewing upcomming appointment details', () => {
    it('should display VA video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {
          atlasConfirmationCode: '1234',
          atlasLocation: {
            address: {
              line: ['5929 Georgia Ave NW'],
              city: 'Washington',
              state: 'DC',
              postalCode: '20011',
            },
          },
          isVideo: true,
          facilityId: '983',
          isAtlas: true,
          kind: VIDEO_TYPES.adhoc,
          extension: {
            patientHasMobileGfe: false,
          },
          providers: [
            {
              name: {
                firstName: ['TEST'],
                lastName: 'PROV',
              },
              display: 'TEST PROV',
            },
          ],
        },
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isVideo: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VideoLayoutAtlas data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Video appointment at an Atlas location/i,
        }),
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /How to join/i,
        }),
      );
      expect(
        screen.getByText(
          /You will use this appointment code to find your appointment using the computer provided at the site:/i,
        ),
      );
      expect(
        screen.container.querySelector(
          'va-additional-info[trigger="How to prepare for your visit"]',
        ),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /When/i,
        }),
      );
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /What/i,
        }),
      );
      expect(screen.getByText(/Primary care/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Who/i,
        }),
      );

      expect(
        screen.getByRole('heading', { level: 2, name: /Where to attend/i }),
      );
      expect(screen.getByText(/5929 Georgia Ave NW/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /Scheduling facility/i,
        }),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Need to make changes/i,
        }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.queryByText(/2360 East Pershing Boulevard/i)).not.to.exist;
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(/Clinic: Clinic 1/i));
      expect(screen.getByText(/Phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
      ).to.be.ok;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });

  describe('When viewing past appointment details', () => {
    it('should display VA video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {
          atlasConfirmationCode: '1234',
          atlasLocation: {
            address: {
              line: ['5929 Georgia Ave NW'],
              city: 'Washington',
              state: 'DC',
              postalCode: '20011',
            },
          },
          isVideo: true,
          facilityId: '983',
          isAtlas: true,
          kind: VIDEO_TYPES.adhoc,
          extension: {
            patientHasMobileGfe: false,
          },
          providers: [
            {
              name: {
                firstName: ['TEST'],
                lastName: 'PROV',
              },
              display: 'TEST PROV',
            },
          ],
        },
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPastAppointment: true,
          isPendingAppointment: false,
          isUpcomingAppointment: false,
          isVideo: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VideoLayoutAtlas data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Past video appointment at an Atlas location/i,
        }),
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /After visit summary/i,
        }),
      );

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /How to join/i,
        }),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /When/i,
        }),
      );
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /What/i,
        }),
      );
      expect(screen.getByText(/Primary care/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Who/i,
        }),
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Where/i,
        }),
      );
      expect(screen.getByText(/5929 Georgia Ave NW/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByRole('heading', { name: /Scheduling facility/i }));
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
      ).to.be.ok;
      expect(screen.queryByRole('heading', { name: /Need to make changes/i }))
        .not.to.exist;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });

  describe('When viewing canceled appointment details', () => {
    it('should display VA video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {
          atlasConfirmationCode: '1234',
          atlasLocation: {
            address: {
              line: ['5929 Georgia Ave NW'],
              city: 'Washington',
              state: 'DC',
              postalCode: '20011',
            },
          },
          isVideo: true,
          facilityId: '983',
          isAtlas: true,
          kind: VIDEO_TYPES.adhoc,
          extension: {
            patientHasMobileGfe: false,
          },
          providers: [
            {
              name: {
                firstName: ['TEST'],
                lastName: 'PROV',
              },
              display: 'TEST PROV',
            },
          ],
        },
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPastAppointment: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isVideo: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'cancelled',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VideoLayoutAtlas data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled video appointment at an Atlas location/i,
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

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /How to join/i,
        }),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /When/i,
        }),
      );
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /What/i,
        }),
      );
      expect(screen.getByText(/Primary care/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Who/i,
        }),
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'Where',
        }),
      );
      // expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/5929 Georgia Ave NW/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByRole('heading', { name: /Scheduling facility/i }));
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
      ).to.be.ok;
      expect(screen.queryByRole('heading', { name: /Need to make changes/i }))
        .not.to.exist;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });
});
