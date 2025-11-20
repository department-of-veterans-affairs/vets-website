import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import TravelReimbursementSection from './TravelReimbursementSection';
import { VIDEO_TYPES } from '../utils/constants';

describe('VAOS Component: TravelReimbursement', () => {
  beforeEach(() => {
    MockDate.set('2021-09-30T10:00:00Z');
  });
  afterEach(() => {
    MockDate.reset();
  });

  const startTime = new Date('2021-09-01T10:00:00Z');
  const inPersonVideoKinds = [VIDEO_TYPES.clinic, VIDEO_TYPES.storeForward];
  inPersonVideoKinds.forEach(kind => {
    it(`should display Travel Reimbursement section with file claim link for ${kind} video appointment`, async () => {
      const appointment = {
        start: startTime,
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
          isPhone: false,
          isVideo: true,
          isVideoAtVA: true,
        },
        videoData: {
          kind,
        },
      };
      const screen = render(
        <TravelReimbursementSection appointment={appointment} />,
      );

      expect(screen.getByText(/Days left to file: 1/i));
      expect(screen.getByTestId('file-claim-link')).to.exist;
    });
  });
  it('should display travel reimbursement section with file claim link', async () => {
    const appointment = {
      id: '1234567890',
      kind: 'clinic',
      type: 'VA',
      modality: 'vaInPerson',
      start: startTime,
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
        isInPersonVisit: true,
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );

    expect(screen.getByText(/Days left to file: 1/i));
    expect(screen.getByTestId('file-claim-link')).to.exist;
    expect(screen.getByTestId('file-claim-link')).to.have.attribute(
      'href',
      `/my-health/travel-pay/file-new-claim/${appointment.id}`,
    );
  });
  it('should display travel reimbursement section with modal confirmation for 30+ day claims', async () => {
    // appointment is past the 30 day window
    const appointment = {
      id: '1234567890',
      start: new Date('2021-08-31T10:00:00Z'),
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
        isInPersonVisit: true,
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );

    expect(screen.getByText(/Days left to file: 0/i));

    // Should show file claim link (not how-to-file-claim-link)
    const fileClaimLink = screen.getByTestId('file-claim-link');
    expect(fileClaimLink).to.exist;

    // Initially modal should not be visible
    const initialModal = screen.container.querySelector(
      'va-modal[visible="false"]',
    );
    expect(initialModal).to.exist;

    // Click the link to trigger modal
    fireEvent.click(fileClaimLink);

    // Modal should now be visible with warning content
    const visibleModal = screen.container.querySelector(
      'va-modal[visible="true"]',
    );
    expect(visibleModal).to.exist;
    expect(visibleModal.getAttribute('modal-title')).to.equal(
      'Your appointment happened more than 30 days ago',
    );
    expect(visibleModal.getAttribute('primary-button-text')).to.equal(
      'Yes, I want to file',
    );
    expect(visibleModal.getAttribute('secondary-button-text')).to.equal(
      'Don’t file',
    );
    expect(
      screen.getByText(
        'Do you still want to file a travel reimbursement claim?',
      ),
    ).to.exist;
  });
  it('should display travel reimbursement section with link to complete claim when status is Saved', async () => {
    const appointment = {
      id: '1234567890',
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
        isInPersonVisit: true,
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );

    expect(
      screen.getByText(
        /You already started a claim for this appointment. Add your expenses and file within 30 days days of your appointment date./i,
      ),
    );
    expect(screen.getByTestId('view-claim-link')).to.exist;
    expect(screen.getByTestId('view-claim-link')).to.have.attribute(
      'href',
      `/my-health/travel-pay/file-new-claim/${appointment.id}`,
    );
    expect(screen.getByTestId('view-claim-link')).to.have.attribute(
      'text',
      'Complete and file your claim',
    );
  });
  it('should display travel reimbursement section with link to complete claim when status is Incomplete', async () => {
    const appointment = {
      id: '1234567890',
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
        isInPersonVisit: true,
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );

    expect(
      screen.getByText(
        /You already started a claim for this appointment. Add your expenses and file within 30 days days of your appointment date./i,
      ),
    );
    expect(screen.getByTestId('view-claim-link')).to.exist;
    expect(screen.getByTestId('view-claim-link')).to.have.attribute(
      'href',
      `/my-health/travel-pay/file-new-claim/${appointment.id}`,
    );
    expect(screen.getByTestId('view-claim-link')).to.have.attribute(
      'text',
      'Complete and file your claim',
    );
  });
  it('should display travel reimbursement section with link to view claim status', async () => {
    const appointment = {
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
        isInPersonVisit: true,
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );

    expect(
      screen.getByText(/You've already filed a claim for this appointment./i),
    );
    expect(screen.getByTestId('view-claim-link')).to.exist;
    expect(screen.getByTestId('view-claim-link')).to.have.attribute(
      'href',
      '/my-health/travel-pay/claims/1234',
    );
  });
  it('should not display travel reimbursement section if appointment is not past', async () => {
    const appointment = {
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'Data retrieved successfully.',
              success: true,
            },
          },
        },
        isPastAppointment: false,
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );
    expect(screen.queryByText(/Travel reimbursement/i)).to.not.exist;
  });
  it('should not display travel reimbursement section if appointment is video', async () => {
    const appointment = {
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'Data retrieved successfully.',
              success: true,
            },
          },
        },
        isPastAppointment: true,
        isVideo: true,
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );
    expect(screen.queryByText(/Travel reimbursement/i)).to.not.exist;
  });
  it('should not display travel reimbursement section if appointment is cc', async () => {
    const appointment = {
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'Data retrieved successfully.',
              success: true,
            },
          },
        },
        isPastAppointment: true,
        isCommunityCare: true,
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );
    expect(screen.queryByText(/Travel reimbursement/i)).to.not.exist;
  });
  it('should not display travel reimbursement section if appointment is phone', async () => {
    const appointment = {
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'Data retrieved successfully.',
              success: true,
            },
          },
        },
        isPastAppointment: true,
        isPhoneAppointment: true,
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );
    expect(screen.queryByText(/Travel reimbursement/i)).to.not.exist;
  });
  it('should not display travel reimbursement section if claim data is not present', async () => {
    const appointment = {
      start: new Date('2021-09-01T10:00:00Z'),
      vaos: {
        apiData: {},
      },
    };
    const screen = render(
      <TravelReimbursementSection appointment={appointment} />,
    );
    expect(screen.queryByText(/Travel reimbursement/i)).to.not.exist;
  });
});
