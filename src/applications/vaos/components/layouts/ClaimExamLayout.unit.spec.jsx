import { expect } from 'chai';
import React from 'react';
import { MockAppointment } from '../../tests/fixtures/MockAppointment';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import MockFacility from '../../tests/fixtures/MockFacility';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import ClaimExamLayout from './ClaimExamLayout';

describe('VAOS Component: ClaimExamLayout', () => {
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
    it('should display view facility info when only facility id is returned but no facility data', async () => {
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
          vistaId: '983',
          clinicId: '848',
          stationId: '983',
          clinicName: 'CHY PC VAR2',
        },
        minutesDuration: 60,
        startUtc: new Date(),
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: true,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          apiData: {
            serviceCategory: [
              {
                text: 'COMPENSATION & PENSION',
              },
            ],
          },
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <ClaimExamLayout data={appointment} />,
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

    it('should display find facility info link when no facility data and no facility id are available', async () => {
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
        minutesDuration: 60,
        startUtc: new Date(),
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: true,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          apiData: {
            serviceCategory: [
              {
                text: 'COMPENSATION & PENSION',
              },
            ],
          },
        },
        status: 'booked',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <ClaimExamLayout data={appointment} />,
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
        type: 'VA',
        modality: 'claimExamAppointment',
        minutesDuration: 60,
        startUtc: new Date(),
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: true,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isCerner: false,
          apiData: {},
        },
        status: 'booked',
      };
      const nullAttributes = {
        type: 'VA',
        modality: 'claimExamAppointment',
        isCerner: false,
        'fields-load-success': '',
        'fields-load-fail':
          'type-of-care,clinic-phone,facility-id,facility-details,facility-phone',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <ClaimExamLayout data={appointment} />,
        {
          store,
        },
      );
      // Assert
      expect(screen.queryByRole('heading', { level: 2, name: /What/i })).not.to
        .exist;
      expect(screen.queryByRole('heading', { level: 2, name: /Who/i })).not.to
        .exist;
      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'span' &&
            content === 'Facility details not available'
          );
        }),
      );
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
        videoData: {},
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
        <ClaimExamLayout data={appointment} />,
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
        videoData: {},
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
        <ClaimExamLayout data={appointment} />,
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
    it('should display claim exam layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        type: 'VA',
        modality: 'claimExamAppointment',
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
          clinicPhone: '500-500-5000',
          clinicPhoneExtension: '1234',
        },
        minutesDuration: 60,
        startUtc: new Date(),
        practitioners: [
          {
            name: {
              family: 'User',
              given: ['Test'],
            },
          },
        ],
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: true,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isCerner: false,
          apiData: {
            serviceCategory: [
              {
                text: 'COMPENSATION & PENSION',
              },
            ],
          },
        },
        status: 'booked',
      };
      const nullAttributes = {
        type: 'VA',
        modality: 'claimExamAppointment',
        isCerner: false,
        'fields-load-success':
          'type-of-care,clinic-phone,facility-id,facility-details,facility-phone',
        'fields-load-fail': '',
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <ClaimExamLayout data={appointment} />,
        {
          store,
        },
      );
      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /claim exam/i,
        }),
      );
      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).to.be.ok;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      const typeOfCare = screen.container.querySelector('.typeOfCareName');
      expect(typeOfCare).to.exist;
      expect(typeOfCare.textContent).to.equal('Claim exam');

      expect(screen.getByRole('heading', { level: 2, name: /Who/i }));
      expect(screen.getByText(/Test User/i));

      expect(
        screen.getByRole('heading', { level: 2, name: /Where to attend/i }),
      );
      expect(screen.getByText(/Cheyenne VA Medical Center/i));
      expect(
        screen.container.querySelector(
          'a[href="https://www.va.gov/cheyenne-health-care/locations/cheyenne-va-medical-center/"]',
        ),
      ).to.be.ok;
      expect(screen.getByText(/2360 East Pershing Boulevard/i));

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;
      expect(screen.getByText(/Location:/i));
      expect(screen.getByText(/CHEYENNE/));

      expect(screen.getByText(/Clinic:/i));
      expect(screen.getByText(/Clinic 1/i));
      expect(screen.getAllByText(/Clinic phone:/i));
      expect(
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;
      expect(screen.container.querySelector('va-telephone[extension="1234"]'))
        .to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Prepare for your appointment/i,
        }),
      );
      expect(
        screen.getByText(/You don.t need to bring anything to your exam/i),
      );
      expect(
        screen.getByText(
          /If you have any new non-VA medical records \(like records from a recent surgery or illness\), be sure to submit them before your appointment/i,
        ),
      );
      expect(
        screen.container.querySelector(
          'a[href="https://www.va.gov/disability/va-claim-exam/"]',
        ),
      ).to.be.ok;
      expect(screen.getByText(/Learn more about claim exam appointments/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Need to make changes/i,
        }),
      ).to.be.ok;

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /Scheduling facility/i,
        }),
      ).not.to.exist;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).to.not.exist;

      expect(window.dataLayer).to.deep.include({
        event: 'vaos-null-states',
        ...nullAttributes,
      });
    });
  });

  describe('When viewing past appointment details', () => {
    it('should display claim exam layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = new MockAppointment()
        .setApiData(new MockAppointmentResponse())
        .setIsCompAndPenAppointment(true)
        .setIsPastAppointment(true)
        .setLocation(new MockFacility());

      // Act
      const screen = renderWithStoreAndRouter(
        <ClaimExamLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Past claim exam/i,
        }),
      );
      expect(
        screen.getByRole('heading', { level: 2, name: /After visit summary/i }),
      );

      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;
      expect(
        screen.queryByRole('heading', { level: 2, name: /How to prepare/i }),
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
      expect(screen.getByText(/Clinic phone/i));
      expect(
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Scheduling facility/i,
        }),
      );

      expect(
        screen.queryByRole('heading', {
          name: /Prepare for your appointment/i,
        }),
      ).not.to.exist;

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /Need to make changes/i,
        }),
      ).not.to.exist;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });

  describe('When viewing canceled appointment details', () => {
    it('should display claim exam layout when in the future', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = new MockAppointment({
        status: APPOINTMENT_STATUS.cancelled,
      })
        .setApiData(new MockAppointmentResponse())
        .setIsCompAndPenAppointment(true)
        .setIsUpcomingAppointment(true)
        .setLocation(new MockFacility());

      // Act
      const screen = renderWithStoreAndRouter(
        <ClaimExamLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled claim exam/i,
        }),
      );
      expect(
        screen.getByText(
          /If you still want this appointment, call your VA health facility’s compensation and pension office to schedule./i,
        ),
      );
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /After visit summary/i,
        }),
      ).not.to.exist;
      expect(
        screen.queryByRole('heading', { level: 2, name: /How to prepare/i }),
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
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Scheduling facility/i,
        }),
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Prepare for your appointment/i,
        }),
      );
      expect(
        screen.getByText(/You don.t need to bring anything to your exam/i),
      );
      expect(
        screen.getByText(
          /If you have any new non-VA medical records \(like records from a recent surgery or illness\), be sure to submit them before your appointment/i,
        ),
      );
      expect(
        screen.container.querySelector(
          'a[href="https://www.va.gov/disability/va-claim-exam/"]',
        ),
      ).to.be.ok;
      expect(screen.getByText(/Learn more about claim exam appointments/i));

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /Need to make changes/i,
        }),
      ).not.to.exist;
      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).to.not.exist;
    });
    it('should display claim exam layout when in the past', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = new MockAppointment({
        status: APPOINTMENT_STATUS.cancelled,
      })
        .setApiData(new MockAppointmentResponse())
        .setIsCompAndPenAppointment(true)
        .setIsPastAppointment(true)
        .setLocation(new MockFacility());

      // Act
      const screen = renderWithStoreAndRouter(
        <ClaimExamLayout data={appointment} />,
        {
          store,
        },
      );

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled claim exam/i,
        }),
      );
      expect(
        screen.getByText(
          /If you still want this appointment, call your VA health facility’s compensation and pension office to schedule./i,
        ),
      );
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /After visit summary/i,
        }),
      ).not.to.exist;
      expect(
        screen.queryByRole('heading', { level: 2, name: /How to prepare/i }),
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
        screen.container.querySelector('va-telephone[contact="500-500-5000"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Scheduling facility/i,
        }),
      );
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /Need to make changes/i,
        }),
      ).not.to.exist;
      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).to.not.exist;
    });
  });
});
