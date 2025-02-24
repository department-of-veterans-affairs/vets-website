import React from 'react';
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
    const screen = renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: true,
            error: null,
            data: mockAppt,
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

  it('should show alert if appointment is not past', () => {
    const screen = renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: null,
            data: {
              kind: 'clinic',
              start: '2050-01-01T14:00:00Z',
            },
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('We need to wait to file your claim')).to.exist;
  });
});
