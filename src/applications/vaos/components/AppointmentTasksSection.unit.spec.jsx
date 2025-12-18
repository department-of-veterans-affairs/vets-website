import React from 'react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import reducers from '../redux/reducer';
import AppointmentTasksSection from './AppointmentTasksSection';
import { VIDEO_TYPES } from '../utils/constants';

describe('VAOS Component: AppointmentTasks', () => {
  beforeEach(() => {
    MockDate.set('2021-09-30T10:00:00Z');
  });
  afterEach(() => {
    MockDate.reset();
  });

  const renderWithFeatureToggles = (
    ui,
    { travelPayEnableComplexClaims = false } = {},
  ) => {
    return renderWithStoreAndRouter(ui, {
      initialState: {
        featureToggles: {
          loading: false,
          // eslint-disable-next-line camelcase
          travel_pay_enable_complex_claims: travelPayEnableComplexClaims,
        },
      },
      reducers,
    });
  };

  const appointmentId = '1234567890';
  const inPersonVideoKinds = [VIDEO_TYPES.clinic, VIDEO_TYPES.storeForward];
  inPersonVideoKinds.forEach(kind => {
    it(`should display Appointment tasks section with file claim link for ${kind} video appointment`, async () => {
      const appointment = {
        id: appointmentId,
        start: new Date('2021-09-01T10:00:00Z'),
        vaos: {
          apiData: {
            travelPayClaim: {
              metadata: {
                status: 200,
                message: 'No claims found.',
                success: true,
              },
            },
          },
          isPastAppointment: true,
          isCommunityCare: false,
          isPhoneAppointment: false,
          isVideo: true,
          isVideoAtVA: true,
        },
        videoData: {
          kind,
        },
      };
      const screen = renderWithFeatureToggles(
        <AppointmentTasksSection appointment={appointment} />,
      );

      expect(screen.getByText(/Appointment tasks/i)).to.exist;
      expect(screen.getByTestId('file-claim-link')).to.have.attribute(
        'href',
        `/my-health/travel-pay/file-new-claim/${appointmentId}`,
      );
      expect(screen.getByText(/Days left to file: 1/i)).to.exist;
    });
  });
  it('should display Appointment tasks section with file claim link', async () => {
    const appointment = {
      id: appointmentId,
      start: new Date('2021-09-01T10:00:00Z'),
      kind: 'clinic',
      type: 'VA',
      modality: 'vaInPerson',
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'No claims found.',
              success: true,
            },
          },
        },
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: false,
        isInPersonVisit: true,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.getByText(/Appointment tasks/i)).to.exist;
    expect(screen.getByTestId('file-claim-link')).to.have.attribute(
      'href',
      `/my-health/travel-pay/file-new-claim/${appointmentId}`,
    );
    expect(screen.getByText(/Days left to file: 1/i)).to.exist;
  });
  it('should not display Appointment tasks section if not a past appointment', async () => {
    const appointment = {
      id: appointmentId,
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'No claims found.',
              success: true,
            },
          },
        },
        isPastAppointment: false,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: false,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if appointment is cc', async () => {
    const appointment = {
      id: appointmentId,
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'No claims found.',
              success: true,
            },
          },
        },
        isPastAppointment: true,
        isCommunityCare: true,
        isPhoneAppointment: false,
        isVideo: false,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if appointment is video', async () => {
    const appointment = {
      id: appointmentId,
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'No claims found.',
              success: true,
            },
          },
        },
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: true,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if appointment is phone', async () => {
    const appointment = {
      id: appointmentId,
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'No claims found.',
              success: true,
            },
          },
        },
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: true,
        isVideo: false,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display file claim link if no claim data', async () => {
    const appointment = {
      id: appointmentId,
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {},
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: false,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display file claim link if days remaining are less than 1', async () => {
    const appointment = {
      start: new Date('2021-08-31T10:00:00Z'),
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'No claims found.',
              success: true,
            },
          },
        },
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: false,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should display "Complete your travel reimbursement claim" link when claim status is Saved', async () => {
    const appointment = {
      id: appointmentId,
      start: new Date('2021-09-01T10:00:00Z'),
      kind: 'clinic',
      type: 'VA',
      modality: 'vaInPerson',
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'Data retrieved successfully.',
              success: true,
            },
            claim: {
              id: '1234',
              claimNumber: 'string',
              claimStatus: 'Saved',
              appointmentDateTime: '2024-01-01T16:45:34.465Z',
              facilityName: 'Cheyenne VA Medical Center',
              createdOn: '2024-03-22T21:22:34.465Z',
              modifiedOn: '2024-01-01T16:44:34.465Z',
            },
          },
        },
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: false,
        isInPersonVisit: true,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
      { travelPayEnableComplexClaims: true },
    );

    const claimId = appointment.vaos.apiData.travelPayClaim.claim.id;

    expect(screen.getByText(/Appointment tasks/i)).to.exist;
    expect(screen.getByTestId('file-claim-link')).to.have.attribute(
      'href',
      `/my-health/travel-pay/claims/${claimId}`,
    );
    expect(screen.getByTestId('file-claim-link')).to.have.attribute(
      'text',
      'Complete your travel reimbursement claim',
    );
    expect(screen.getByText(/Days left to file: 1/i)).to.exist;
  });
  it('should display "Complete your travel reimbursement claim" link when claim status is Incomplete', async () => {
    const appointment = {
      id: appointmentId,
      start: new Date('2021-09-01T10:00:00Z'),
      kind: 'clinic',
      type: 'VA',
      modality: 'vaInPerson',
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'Data retrieved successfully.',
              success: true,
            },
            claim: {
              id: '1234',
              claimNumber: 'string',
              claimStatus: 'Incomplete',
              appointmentDateTime: '2024-01-01T16:45:34.465Z',
              facilityName: 'Cheyenne VA Medical Center',
              createdOn: '2024-03-22T21:22:34.465Z',
              modifiedOn: '2024-01-01T16:44:34.465Z',
            },
          },
        },
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: false,
        isInPersonVisit: true,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
      { travelPayEnableComplexClaims: true },
    );

    const claimId = appointment.vaos.apiData.travelPayClaim.claim.id;

    expect(screen.getByText(/Appointment tasks/i)).to.exist;
    expect(screen.getByTestId('file-claim-link')).to.have.attribute(
      'href',
      `/my-health/travel-pay/claims/${claimId}`,
    );
    expect(screen.getByTestId('file-claim-link')).to.have.attribute(
      'text',
      'Complete your travel reimbursement claim',
    );
    expect(screen.getByText(/Days left to file: 1/i)).to.exist;
  });
  it('should not display Appointment tasks section when claim has been filed (not Saved or Incomplete)', async () => {
    const appointment = {
      id: appointmentId,
      start: new Date('2021-09-01T10:00:00Z'),
      kind: 'clinic',
      type: 'VA',
      modality: 'vaInPerson',
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'Data retrieved successfully.',
              success: true,
            },
            claim: {
              id: '1234',
              claimNumber: 'string',
              claimStatus: 'InProgress',
              appointmentDateTime: '2024-01-01T16:45:34.465Z',
              facilityName: 'Cheyenne VA Medical Center',
              createdOn: '2024-03-22T21:22:34.465Z',
              modifiedOn: '2024-01-01T16:44:34.465Z',
            },
          },
        },
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: false,
        isInPersonVisit: true,
      },
    };
    const screen = renderWithFeatureToggles(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
});
