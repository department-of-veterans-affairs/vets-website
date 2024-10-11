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

    it('should display facility phone when clinic phone is missing', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
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
          isCompAndPenAppointment: true,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
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
        screen.container.querySelector('va-telephone[contact="307-778-7550"]'),
      ).to.be.ok;
    });

    it('should display VA main phone when facility id is missing', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        location: {},
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
          isCompAndPenAppointment: true,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
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
        screen.container.querySelector('va-telephone[contact="800-698-2411"]'),
      ).to.be.ok;
    });
  });

  describe('When viewing upcoming appointment details', () => {
    it('should display VA video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        comment: 'This is a test:Additional information',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
          clinicPhone: '500-500-5000',
          clinicPhoneExtension: '1234',
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
          /You’ll use this appointment code to find your appointment using the computer provided at the site:/i,
        ),
      );

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
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;
      expect(screen.container.querySelector('va-telephone[extension="1234"]'))
        .to.be.ok;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Prepare for your appointment/i,
        }),
      );
      expect(
        screen.getByText(
          /Bring your insurance cards. And bring a list of your medications and other information to share with your provider./i,
        ),
      );
      expect(
        screen.container.querySelector(
          'va-link[href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"]',
        ),
      ).to.be.ok;
      expect(
        screen.container.querySelector(
          'va-link[text="Find a full list of things to bring to your appointment"]',
        ),
      ).to.be.ok;
      expect(screen.getByText(/Get your device ready to join./i));
      expect(
        screen.container.querySelector(
          'va-additional-info[trigger="How to setup your device"]',
        ),
      ).to.be.ok;
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
          clinicPhone: '500-500-5000',
          clinicPhoneExtension: '1234',
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
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;
      expect(screen.queryByRole('heading', { name: /Need to make changes/i }))
        .not.to.exist;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;

      expect(
        screen.queryByRole('heading', {
          name: /Prepare for your appointment/i,
        }),
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
          clinicPhone: '500-500-5000',
          clinicPhoneExtension: '1234',
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
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;
      expect(screen.queryByRole('heading', { name: /Need to make changes/i }))
        .not.to.exist;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Prepare for your appointment/i,
        }),
      );
      expect(
        screen.getByText(
          /Bring your insurance cards. And bring a list of your medications and other information to share with your provider./i,
        ),
      );
      expect(
        screen.container.querySelector(
          'va-link[href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"]',
        ),
      ).to.be.ok;
      expect(
        screen.container.querySelector(
          'va-link[text="Find a full list of things to bring to your appointment"]',
        ),
      ).to.be.ok;
      expect(screen.getByText(/Get your device ready to join./i));
      expect(
        screen.container.querySelector(
          'va-additional-info[trigger="How to setup your device"]',
        ),
      ).to.be.ok;
    });
  });
});
