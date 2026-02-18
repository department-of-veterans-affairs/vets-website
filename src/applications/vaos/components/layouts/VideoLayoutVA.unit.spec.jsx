import { expect } from 'chai';
import React from 'react';

import { subDays } from 'date-fns';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../tests/fixtures/MockFacilityResponse';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import { textMatcher } from '../../tests/utils';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import VideoLayoutVA from './VideoLayoutVA';

describe('VAOS Component: VideoLayoutVA', () => {
  const initialState = {
    appointments: {
      facilityData: {
        983: {
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
    it('should display view facility info when only facility id is returned', async () => {
      // Arrange
      const state = {
        ...initialState,
        appointments: {
          facilityData: {},
        },
      };
      const store = createTestStore(state);
      const response = MockAppointmentResponse.createClinicResponse({
        localStartTime: new Date(),
      }).setLocation(null);
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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
      const response = MockAppointmentResponse.createClinicResponse({
        localStartTime: new Date(),
      }).setLocationId(null);
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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
      const nullAttributes = {
        type: 'VA',
        modality: 'vaVideoCareAtAVaLocation',
        isCerner: false,
        'fields-load-success': '',
        'fields-load-fail':
          'type-of-care,provider,clinic-phone,facility-id,facility-details,facility-phone',
      };
      const response = MockAppointmentResponse.createClinicResponse({
        localStartTime: new Date(),
      })
        .setLocationId(null)
        .setTypeOfCare(null);
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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

      expect(window.dataLayer).to.deep.include({
        event: 'vaos-null-states',
        ...nullAttributes,
      });
    });

    it('should display facility phone when clinic phone is missing', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createClinicResponse({
        localStartTime: new Date(),
      })
        .setLocation(new MockFacilityResponse())
        .setPractitioner();
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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
      const response = MockAppointmentResponse.createClinicResponse({
        localStartTime: new Date(),
      }).setLocationId(null);
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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

    describe('And appointment is Cerner', () => {
      it('should not display clinic heading when service name is missing', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const response = MockAppointmentResponse.createClinicResponse({
          isCerner: true,
          localStartTime: new Date(),
        }).setLocation(new MockFacilityResponse());
        const appointment = MockAppointmentResponse.getTransformedResponse(
          response,
        );

        // Act
        const screen = renderWithStoreAndRouter(
          <VideoLayoutVA data={appointment} />,
          {
            store,
          },
        );

        // Assert
        expect(screen.queryByText(textMatcher({ text: 'Clinic: Clinic 1' })))
          .not.to.exist;
      });

      it('should not display location heading when physical location is missing', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const response = MockAppointmentResponse.createClinicResponse({
          isCerner: true,
          localStartTime: new Date(),
        }).setLocation(new MockFacilityResponse());
        const appointment = MockAppointmentResponse.getTransformedResponse(
          response,
        );

        // Act
        const screen = renderWithStoreAndRouter(
          <VideoLayoutVA data={appointment} />,
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
    describe('And video type is clinic', () => {
      it('should display VA video layout', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const nullAttributes = {
          type: 'VA',
          modality: 'vaVideoCareAtAVaLocation',
          isCerner: false,
          'fields-load-success':
            'type-of-care,provider,clinic-phone,facility-id,facility-details,facility-phone',
          'fields-load-fail': '',
        };
        const response = MockAppointmentResponse.createClinicResponse({
          localStartTime: new Date(),
        })
          .setClinicPhoneNumber('500-500-5000')
          .setClinicPhoneNumberExtension('1234')
          .setServiceName('Clinic 1')
          .setLocation(new MockFacilityResponse())
          .setPractitioner();
        const appointment = MockAppointmentResponse.getTransformedResponse(
          response,
        );

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
        expect(
          screen.container.querySelector(
            'a[href="https://www.va.gov/cheyenne-health-care/locations/cheyenne-va-medical-center/"]',
          ),
        ).to.be.ok;
        expect(screen.getByText(/2360 East Pershing Boulevard/i));
        expect(screen.container.querySelector('va-icon[icon="directions"]')).to
          .be.ok;

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

        expect(window.dataLayer).to.deep.include({
          event: 'vaos-null-states',
          ...nullAttributes,
        });
      });
    });

    describe('And video type is store forward', () => {
      it('should display VA video layout', async () => {
        // Arrange
        const store = createTestStore(initialState);
        const response = MockAppointmentResponse.createStoreForwardResponse({
          localStartTime: new Date(),
        })
          .setClinicPhoneNumber('500-500-5000')
          .setLocation(new MockFacilityResponse())
          .setPractitioner()
          .setServiceName('Clinic 1');
        const appointment = MockAppointmentResponse.getTransformedResponse(
          response,
        );

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

        expect(screen.getByText(textMatcher({ text: 'Clinic: Clinic 1' })));
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
      });
    });
  });

  describe('When viewing past appointment details', () => {
    it('should display VA video layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createClinicResponse({
        localStartTime: subDays(new Date(), 1),
        past: true,
      })
        .setClinicPhoneNumber('500-500-5000')
        .setServiceName('Clinic 1')
        .setLocation(new MockFacilityResponse())
        .setPractitioner();
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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
          name: /Where/i,
        }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

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
    it('should display VA video layout when in the future', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createClinicResponse({
        localStartTime: new Date(),
        status: APPOINTMENT_STATUS.cancelled,
      })
        .setClinicPhoneNumber('500-500-5000')
        .setLocation(new MockFacilityResponse())
        .setPhysicalLocation('CHEYENNE')
        .setPractitioner()
        .setServiceName('Clinic 1');
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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
          name: /Where/i,
        }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(textMatcher({ text: 'Clinic: Clinic 1' })));
      expect(screen.getByText(/Location:/i));
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

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
    it('should display VA video layout when in the past', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createClinicResponse({
        localStartTime: subDays(new Date(), 2),
        past: true,
        status: APPOINTMENT_STATUS.cancelled,
      })
        .setClinicPhoneNumber('500-500-5000')
        .setLocation(new MockFacilityResponse())
        .setPhysicalLocation('CHEYENNE')
        .setPractitioner()
        .setServiceName('Clinic 1');
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

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
          name: /Where/i,
        }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(screen.getByText(/2360 East Pershing Boulevard/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(screen.getByText(textMatcher({ text: 'Clinic: Clinic 1' })));
      expect(screen.getByText(/Location:/i));
      expect(screen.getByText(/Phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });
});
