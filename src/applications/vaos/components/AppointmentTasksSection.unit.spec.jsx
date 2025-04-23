import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import AppointmentTasksSection from './AppointmentTasksSection';
import { VIDEO_TYPES } from '../utils/constants';

describe('VAOS Component: AppointmentTasks', () => {
  beforeEach(() => {
    MockDate.set('2021-09-30T10:00:00Z');
  });
  afterEach(() => {
    MockDate.reset();
  });

  const appointmentId = '1234567890';
  const inPersonVideoKinds = [VIDEO_TYPES.clinic, VIDEO_TYPES.storeForward];
  inPersonVideoKinds.forEach(kind => {
    it(`should display Appointment tasks section with file claim link for ${kind} video appointment`, async () => {
      const appointment = {
        id: appointmentId,
        start: '2021-09-01T10:00:00Z',
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
        videoData: {
          kind,
        },
      };
      const screen = render(
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
      start: '2021-09-01T10:00:00Z',
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
    const screen = render(
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
      start: '2021-09-01T10:00:00Z',
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
    const screen = render(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if appointment is cc', async () => {
    const appointment = {
      id: appointmentId,
      start: '2021-09-01T10:00:00Z',
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
    const screen = render(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if appointment is video', async () => {
    const appointment = {
      id: appointmentId,
      start: '2021-09-01T10:00:00Z',
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
    const screen = render(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if appointment is phone', async () => {
    const appointment = {
      id: appointmentId,
      start: '2021-09-01T10:00:00Z',
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
    const screen = render(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display file claim link if no claim data', async () => {
    const appointment = {
      id: appointmentId,
      start: '2021-09-01T10:00:00Z',
      vaos: {
        apiData: {},
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: false,
      },
    };
    const screen = render(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display file claim link if days remaining are less than 1', async () => {
    const appointment = {
      start: '2021-08-31T10:00:00Z',
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
    const screen = render(
      <AppointmentTasksSection appointment={appointment} />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
});
