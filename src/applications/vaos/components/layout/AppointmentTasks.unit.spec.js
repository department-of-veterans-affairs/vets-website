import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { subDays } from 'date-fns';
import AppointmentTasks from '../AppointmentTasks';
import { VIDEO_TYPES } from '../../utils/constants';

describe('VAOS Component: AppointmentTasks', () => {
  const inPersonVideoKinds = [VIDEO_TYPES.clinic, VIDEO_TYPES.storeForward];
  inPersonVideoKinds.forEach(kind => {
    it(`should display Appointment tasks section with file claim link for ${kind} video appointment`, async () => {
      const startTime = subDays(new Date(), 20).toISOString();
      const appointment = {
        start: startTime,
        vaos: {
          apiData: {
            travelPayClaim: {
              metadata: {
                status: '200',
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
      const screen = render(<AppointmentTasks appointment={appointment} />);

      expect(screen.getByText(/Appointment tasks/i)).to.exist;
      expect(screen.getByTestId('file-claim-link')).to.have.attribute(
        'href',
        `/appointments/claims/?date=${startTime}`,
      );
      expect(screen.getByText(/Days left to file: 9/i)).to.exist;
    });
  });
  it('should display Appointment tasks section with file claim link', async () => {
    const startTime = subDays(new Date(), 20).toISOString();
    const appointment = {
      start: startTime,
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: '200',
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
    const screen = render(<AppointmentTasks appointment={appointment} />);

    expect(screen.getByText(/Appointment tasks/i)).to.exist;
    expect(screen.getByTestId('file-claim-link')).to.have.attribute(
      'href',
      `/appointments/claims/?date=${startTime}`,
    );
    expect(screen.getByText(/Days left to file: 9/i)).to.exist;
  });
  it('should not display Appointment tasks section if not a past appointment', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: '200',
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
    const screen = render(<AppointmentTasks appointment={appointment} />);

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if appointment is cc', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: '200',
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
    const screen = render(<AppointmentTasks appointment={appointment} />);

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if appointment is video', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: '200',
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
    const screen = render(<AppointmentTasks appointment={appointment} />);

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if appointment is phone', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: '200',
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
    const screen = render(<AppointmentTasks appointment={appointment} />);

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display file claim link if no claim data', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
      vaos: {
        apiData: {},
        isPastAppointment: true,
        isCommunityCare: false,
        isPhoneAppointment: false,
        isVideo: false,
      },
    };
    const screen = render(<AppointmentTasks appointment={appointment} />);

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display file claim link if days remaining are less than 1', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: '200',
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
    const screen = render(<AppointmentTasks appointment={appointment} />);

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
});
