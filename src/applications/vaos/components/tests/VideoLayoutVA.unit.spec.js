import React from 'react';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import VideoLayoutVA from '../layout/VideoLayoutVA';
import { VIDEO_TYPES } from '../../utils/constants';

describe('VAOS Component: VideoLayoutVA', () => {
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
      vaOnlineSchedulingMedReviewInstructions: true,
    },
  };

  describe('When appointment information is missing', () => {
    it('should display view facility info when only facility id is returned', async () => {
      // Arrange
      const state = {
        ...initialState,
        appointments: {
          facilityData: {},
        },
      };
      const store = createTestStore(state);

      const appointment = {
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
        },
        videoData: {
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.clinic,
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
        <VideoLayoutVA data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', { level: 2, name: /Where to attend/i }),
      );
      expect(screen.getByText(/Facility details not available/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).not
        .to.exist;
      expect(
        screen.getByRole('link', {
          name: /View facility information Link opens in a new tab./i,
        }),
      );
    });

    it('should display find facility info when no facility data and no facility id are available', async () => {
      // Arrange
      const state = {
        ...initialState,
        appointments: {
          facilityData: {},
        },
      };
      const store = createTestStore(state);

      const appointment = {
        location: {},
        videoData: {
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.clinic,
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
        <VideoLayoutVA data={appointment} />,
        {
          store,
        },
      );

      // Assert
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
    });

    it('should not display heading and text for empty data', async () => {
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
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.clinic,
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
        <VideoLayoutVA data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Video appointment at a VA location/i,
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
    });
    it('should display facility phone when clinic phone is missing', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        location: {
          stationId: '983',
        },
        videoData: {
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.clinic,
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
        <VideoLayoutVA data={appointment} />,
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
          isVideo: true,
          facilityId: null,
          kind: VIDEO_TYPES.clinic,
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
        <VideoLayoutVA data={appointment} />,
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
    describe('And video type is clinic', () => {
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
            isVideo: true,
            facilityId: '983',
            kind: VIDEO_TYPES.clinic,
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
          <VideoLayoutVA data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(
          screen.getByRole('heading', {
            level: 1,
            name: /Video appointment at a VA location/i,
          }),
        );

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /How to join/i,
          }),
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
          screen.getByRole('heading', {
            level: 2,
            name: /Need to make changes/i,
          }),
        );
        expect(screen.getByText(/Cheyenne VA Medical Center/i));
        expect(screen.getByText(/2360 East Pershing Boulevard/i));
        expect(screen.container.querySelector('va-icon[icon="directions"]')).to
          .be.ok;

        expect(screen.getByText(/Clinic: Clinic 1/i));
        expect(screen.getByText(/Phone:/i));
        expect(
          screen.container.querySelector(
            'va-telephone[contact="500-500-5000"]',
          ),
        ).to.be.ok;
        expect(screen.container.querySelector('va-telephone[extension="1234"]'))
          .to.be.ok;

        expect(screen.container.querySelector('va-button[text="Print"]')).to.be
          .ok;
        expect(
          screen.container.querySelector(
            'va-button[text="Cancel appointment"]',
          ),
        ).not.to.exist;

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /Prepare for your appointment/i,
          }),
        );
        expect(
          screen.getByText(
            /Bring your insurance cards and a list of your medications and other information to share with your provider./i,
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
      });
    });

    describe('And video type is store forward', () => {
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
            isVideo: true,
            facilityId: '983',
            kind: VIDEO_TYPES.storeForward,
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
          <VideoLayoutVA data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(
          screen.getByRole('heading', {
            level: 1,
            name: /Video appointment at a VA location/i,
          }),
        );

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /How to join/i,
          }),
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
          screen.getByRole('heading', {
            level: 2,
            name: /Need to make changes/i,
          }),
        );
        expect(screen.getByText(/Cheyenne VA Medical Center/i));
        expect(screen.getByText(/2360 East Pershing Boulevard/i));
        expect(screen.container.querySelector('va-icon[icon="directions"]')).to
          .be.ok;

        expect(screen.getByText(/Clinic: Clinic 1/i));
        expect(screen.getByText(/Phone:/i));
        expect(
          screen.container.querySelector(
            'va-telephone[contact="500-500-5000"]',
          ),
        ).to.be.ok;

        expect(screen.container.querySelector('va-button[text="Print"]')).to.be
          .ok;
        expect(
          screen.container.querySelector(
            'va-button[text="Cancel appointment"]',
          ),
        ).not.to.exist;

        expect(
          screen.getByRole('heading', {
            level: 2,
            name: /Prepare for your appointment/i,
          }),
        );
        expect(
          screen.getByText(
            /Bring your insurance cards and a list of your medications and other information to share with your provider./i,
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
      });
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
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.clinic,
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
        <VideoLayoutVA data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Past video appointment at VA location/i,
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
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(/Clinic: Clinic 1/i));
      expect(screen.getByText(/Phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;

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
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.clinic,
          extension: {
            patientHasMobileGfe: true,
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
        <VideoLayoutVA data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled video appointment at VA location/i,
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
          name: /Where/i,
        }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(/Clinic: Clinic 1/i));
      expect(screen.getByText(/Location: CHEYENNE/i));
      expect(screen.getByText(/Phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Prepare for your appointment/i,
        }),
      );
      expect(
        screen.getByText(
          /Bring your insurance cards and a list of your medications and other information to share with your provider./i,
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

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });
});
