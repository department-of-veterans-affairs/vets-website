import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import IntroductionPage from '../../../../components/submit-flow/pages/IntroductionPage';
import reducer from '../../../../redux/reducer';

const mockAppt = {
  start: '2024-12-30T14:00:00Z',
  localStartTime: '2024-12-30T08:00:00.000-06:00',
  location: {
    id: '983',
    type: 'appointments',
    attributes: {
      name: 'Cheyenne VA Medical Center',
    },
  },
};

describe('Introduction page', () => {
  afterEach(() => {
    MockDate.reset();
  });

  const props = {
    onStart: () => {},
  };

  it('should render a loading indicator while fetching appointment details', () => {
    const screen = renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: true,
            error: null,
            data: null,
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('File a travel reimbursement claim')).to.exist;
    expect(screen.getByTestId('travel-pay-loading-indicator')).to.exist;
  });

  it('should render with link to file a claim if data has loaded', () => {
    MockDate.set('2025-01-05');
    const screen = renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: true,
            error: null,
            data: {
              ...mockAppt,
              isPast: true,
              daysSinceAppt: 6,
              isOutOfBounds: false,
            },
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('File a travel reimbursement claim')).to.exist;
    expect($('va-link-action[text="File a mileage only claim"]')).to.exist;
  });

  it('should show alert if appointment fetch fails', () => {
    const screen = renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: 'there was a problem',
            data: null,
          },
        },
      },
      reducers: reducer,
    });

    expect(
      screen.getByText(
        'We’re sorry, we can’t access your appointment details right now',
      ),
    ).to.exist;
  });

  it('should show future appt alert if appointment is not past', () => {
    MockDate.set('2024-12-28');
    const screen = renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: null,
            data: {
              ...mockAppt,
              isPast: false,
              daysSinceAppt: null,
              isOutOfBounds: false,
            },
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('We need to wait to file your claim')).to.exist;
  });

  it('should show warning alert if appointment was >30 days ago', () => {
    MockDate.set('2025-02-28');
    const screen = renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: true,
            error: null,
            data: {
              ...mockAppt,
              isPast: true,
              daysSinceAppt: 60,
              isOutOfBounds: true,
            },
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('Your appointment is older than 30 days')).to.exist;
  });
});
