import { expect } from 'chai';
import { subDays } from 'date-fns';
import React from 'react';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../tests/fixtures/MockFacilityResponse';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import { textMatcher } from '../../tests/utils';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import VideoLayout from './VideoLayout';

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
      const response = MockAppointmentResponse.createGfeResponse({
        localStartTime: new Date(),
      }).setTypeOfCare(null);
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );
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

      expect(screen.queryByText(textMatcher({ text: 'Clinic: Not available' })))
        .not.to.exist;
      expect(screen.getByText(/Facility not available/i));

      expect(window.dataLayer).to.deep.include({
        event: 'vaos-null-states',
        ...nullAttributes,
      });
    });

    it('should display facility phone when clinic phone is missing', async () => {
      // Arrange
      const store = createTestStore(initialState);

      // Act
      const response = MockAppointmentResponse.createGfeResponse({
        localStartTime: new Date(),
        status: APPOINTMENT_STATUS.cancelled,
      }).setLocation(new MockFacilityResponse());
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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
      const response = MockAppointmentResponse.createGfeResponse({
        localStartTime: new Date(),
      }).setLocationId(null);
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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

    describe('And appointment is Cerner', () => {
      it('should not display clinic heading when service name is missing', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const response = MockAppointmentResponse.createGfeResponse({
          isCerner: true,
          localStartTime: new Date(),
        }).setLocation(new MockFacilityResponse());
        const appointment = MockAppointmentResponse.getTransformedResponse(
          response,
        );

        // Act
        const screen = renderWithStoreAndRouter(
          <VideoLayout data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(screen.queryByText(/Clinic: Service name/i)).not.to.exist;
      });

      it('should not display location heading when physical location is missing', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const response = MockAppointmentResponse.createGfeResponse({
          isCerner: true,
          localStartTime: new Date(),
        }).setLocation(new MockFacilityResponse());
        const appointment = MockAppointmentResponse.getTransformedResponse(
          response,
        );

        // Act
        const screen = renderWithStoreAndRouter(
          <VideoLayout data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(screen.queryByText(/Location:/i)).not.to.exist;
      });
    });
  });

  describe('When viewing upcoming appointment details', () => {
    it('should display video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createGfeResponse({
        localStartTime: new Date(),
      })
        .setClinicPhoneNumber('500-500-5000')
        .setClinicPhoneNumberExtension('1234')
        .setServiceName('Clinic 1')
        .setPractitioner();
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );
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

      expect(screen.getByText(textMatcher({ text: 'Clinic: Clinic 1' })));
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

      // Act
      const response = MockAppointmentResponse.createGfeResponse({
        localStartTime: subDays(new Date(), 1),
        past: true,
      })
        .setClinicPhoneNumber('500-500-5000')
        .setClinicPhoneNumberExtension('1234')
        .setServiceName('Clinic 1')
        .setPractitioner();
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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
          name: /After-visit summary/i,
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

      expect(screen.getByText(textMatcher({ text: 'Clinic: Clinic 1' })));
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

        // Act
        const response = MockAppointmentResponse.createGfeResponse({
          localStartTime: new Date(),
          status: APPOINTMENT_STATUS.cancelled,
        })
          .setClinicPhoneNumber('500-500-5000')
          .setClinicPhoneNumberExtension('1234')
          .setServiceName('Clinic 1')
          .setPractitioner();
        const appointment = MockAppointmentResponse.getTransformedResponse(
          response,
        );

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
            name: /After-visit summary/i,
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

        expect(screen.getByText(textMatcher({ text: 'Clinic: Clinic 1' })));
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

        // Act
        const response = MockAppointmentResponse.createGfeResponse({
          localStartTime: new Date(),
          status: APPOINTMENT_STATUS.cancelled,
        })
          .setClinicPhoneNumber('500-500-5000')
          .setClinicPhoneNumberExtension('1234')
          .setServiceName('Clinic 1')
          .setPractitioner();
        const appointment = MockAppointmentResponse.getTransformedResponse(
          response,
        );

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
            name: /After-visit summary/i,
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

        expect(screen.getByText(textMatcher({ text: 'Clinic: Clinic 1' })));
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
        const response = MockAppointmentResponse.createGfeResponse({
          localStartTime: new Date(),
          status: APPOINTMENT_STATUS.cancelled,
        })
          .setClinicPhoneNumber('500-500-5000')
          .setClinicPhoneNumberExtension('1234')
          .setServiceName('Clinic 1')
          .setPractitioner();
        const appointment = MockAppointmentResponse.getTransformedResponse(
          response,
        );

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
            name: /After-visit summary/i,
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

        expect(screen.getByText(textMatcher({ text: 'Clinic: Clinic 1' })));
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
