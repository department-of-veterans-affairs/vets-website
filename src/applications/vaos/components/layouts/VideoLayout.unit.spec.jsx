import React from 'react';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import VideoLayout from './VideoLayout';
import { VIDEO_TYPES } from '../../utils/constants';

describe('VAOS Component: VideoLayout', () => {
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
          website:
            'https://www.va.gov/cheyenne-health-care/locations/cheyenne-va-medical-center/',
        },
      },
    },
  };

  describe('When appointment information is missing', () => {
    const nullInitialState = {
      appointments: {},
    };
    it('should not display heading and text for empty data', async () => {
      // Arrange
      const store = createTestStore(nullInitialState);
      const appointment = {
        type: 'VA',
        modality: 'vaVideoCareAtHome',
        location: {},
        minutesDuration: 60,
        startUtc: new Date(),
        videoData: {
          isVideo: true,
          facilityId: null,
          kind: 'ADHOC',
          duration: 30,
          providers: [],
          atlasLocation: null,
          extension: {
            patientHasMobileGfe: false,
          },
        },
        vaos: {
          isAtlas: false,
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isVideo: true,
          isCerner: false,
          apiData: {},
        },
        status: 'booked',
      };
      const nullAttributes = {
        type: 'VA',
        modality: 'vaVideoCareAtHome',
        isCerner: false,
        'fields-load-success': '',
        'fields-load-fail':
          'type-of-care,provider,clinic-phone,facility-details,facility-phone',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VideoLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Video appointment/i,
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

      expect(screen.getByText(/Clinic not available/i));
      expect(screen.getByText(/Facility not available/i));

      expect(window.dataLayer).to.deep.include({
        event: 'vaos-null-states',
        ...nullAttributes,
      });
    });

    it('should display facility phone when clinic phone is missing', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        location: {
          stationId: '983',
        },
        minutesDuration: 60,
        startUtc: new Date(),
        videoData: {
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.mobile,
          extension: {
            patientHasMobileGfe: true,
          },
          providers: [],
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
        <VideoLayout data={appointment} />,
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
        minutesDuration: 60,
        startUtc: new Date(),
        videoData: {
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.mobile,
          extension: {
            patientHasMobileGfe: true,
          },
          providers: [],
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
        <VideoLayout data={appointment} />,
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
    it('should display video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        type: 'VA',
        modality: 'vaVideoCareAtHome',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
          clinicPhone: '500-500-5000',
          clinicPhoneExtension: '1234',
        },
        minutesDuration: 60,
        startUtc: new Date(),
        videoData: {
          isVideo: true,
          facilityId: '983',
          kind: VIDEO_TYPES.mobile,
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
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isVideo: true,
          isCerner: false,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };
      const nullAttributes = {
        type: 'VA',
        modality: 'vaVideoCareAtHome',
        isCerner: false,
        'fields-load-success':
          'type-of-care,provider,clinic-phone,facility-details,facility-phone',
        'fields-load-fail': '',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <VideoLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Video appointment/i,
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
      expect(
        screen.container.querySelector(
          'a[href="https://www.va.gov/cheyenne-health-care/locations/cheyenne-va-medical-center/"]',
        ),
      ).to.be.ok;
      expect(screen.queryByText(/2360 East Pershing Boulevard/i)).not.to.exist;

      expect(screen.getByText(/Clinic: Clinic 1/i));
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
          /Bring your insurance cards, a list of your medications, and other things to share with your provider/i,
        ),
      );
      expect(
        screen.container.querySelector(
          'va-link[href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"]',
        ),
      ).to.be.ok;
      expect(
        screen.container.querySelector(
          'va-link[text="Find out what to bring to your appointment"]',
        ),
      ).to.be.ok;
      expect(screen.getByText(/Get your device ready to join/i));
      expect(
        screen.container.querySelector(
          'va-link[text="Learn how to prepare for your video appointment"]',
        ),
      ).to.be.ok;

      expect(window.dataLayer).to.deep.include({
        event: 'vaos-null-states',
        ...nullAttributes,
      });
    });
  });

  describe('When viewing past appointment details', () => {
    it('should display video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
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
          kind: VIDEO_TYPES.mobile,
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
        <VideoLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Past video appointment/i,
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
          name: /Scheduling facility/i,
        }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.queryByText(/2360 East Pershing Boulevard/i)).not.to.exist;

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
    describe('And the appointment is in the past', () => {
      it('should display video layout ', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const appointment = {
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
            kind: VIDEO_TYPES.adhoc,
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
            isPastAppointment: true,
            isPendingAppointment: false,
            isUpcomingAppointment: false,
            isVideo: true,
            apiData: {
              serviceType: 'primaryCare',
            },
          },
          status: 'cancelled',
        };

        // Act
        const screen = renderWithStoreAndRouter(
          <VideoLayout data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(
          screen.getByRole('heading', {
            level: 1,
            name: /Canceled video appointment/i,
          }),
        );

        expect(
          screen.getByText(
            /If you still want this appointment, call your VA health facility to schedule./i,
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
            name: /Scheduling facility/i,
          }),
        );
        expect(screen.getByText(/Cheyenne VA Medical Center/i));
        expect(screen.queryByText(/2360 East Pershing Boulevard/i)).not.to
          .exist;

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
      });
    });

    describe('And video type is mobile', () => {
      it('should display video layout', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const appointment = {
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
            kind: VIDEO_TYPES.mobile,
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
          <VideoLayout data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(
          screen.getByRole('heading', {
            level: 1,
            name: /Canceled video appointment/i,
          }),
        );

        expect(
          screen.getByText(
            /If you still want this appointment, call your VA health facility to schedule./i,
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
            name: /Scheduling facility/i,
          }),
        );
        expect(screen.getByText(/Cheyenne VA Medical Center/i));
        expect(screen.queryByText(/2360 East Pershing Boulevard/i)).not.to
          .exist;

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
            /Bring your insurance cards, a list of your medications, and other things to share with your provider/i,
          ),
        );
        expect(
          screen.container.querySelector(
            'va-link[href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"]',
          ),
        ).to.be.ok;
        expect(
          screen.container.querySelector(
            'va-link[text="Find out what to bring to your appointment"]',
          ),
        ).to.be.ok;
        expect(screen.getByText(/Get your device ready to join/i));
        expect(
          screen.container.querySelector(
            'va-link[text="Learn how to prepare for your video appointment"]',
          ),
        ).to.be.ok;
      });
    });

    describe('And video type is adhoc', () => {
      it('should display video layout', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const appointment = {
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
            kind: VIDEO_TYPES.adhoc,
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
          <VideoLayout data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(
          screen.getByRole('heading', {
            level: 1,
            name: /Canceled video appointment/i,
          }),
        );

        expect(
          screen.getByText(
            /If you still want this appointment, call your VA health facility to schedule./i,
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
            name: /Scheduling facility/i,
          }),
        );
        expect(screen.getByText(/Cheyenne VA Medical Center/i));
        expect(screen.queryByText(/2360 East Pershing Boulevard/i)).not.to
          .exist;

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
            /Bring your insurance cards, a list of your medications, and other things to share with your provider/i,
          ),
        );
        expect(
          screen.container.querySelector(
            'va-link[href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"]',
          ),
        ).to.be.ok;
        expect(
          screen.container.querySelector(
            'va-link[text="Find out what to bring to your appointment"]',
          ),
        ).to.be.ok;
        expect(screen.getByText(/Get your device ready to join/i));
        expect(
          screen.container.querySelector(
            'va-link[text="Learn how to prepare for your video appointment"]',
          ),
        ).to.be.ok;
      });
    });
  });
});
