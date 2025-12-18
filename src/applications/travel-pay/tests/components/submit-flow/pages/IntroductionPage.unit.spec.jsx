import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as recordEventModule from 'platform/monitoring/record-event';

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
  let recordEventStub;
  const onStartSpy = sinon.spy();

  const props = {
    onStart: onStartSpy,
  };

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    MockDate.reset();
    recordEventStub.restore();
  });

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
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('File a travel reimbursement claim')).to.exist;
    expect(screen.getByTestId('travel-pay-loading-indicator')).to.exist;
  });

  it('should record the pageview', () => {
    MockDate.set('2025-01-05');
    renderWithStoreAndRouter(<IntroductionPage {...props} />, {
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
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
      reducers: reducer,
    });

    expect(
      recordEventStub.calledWith({
        event: 'smoc-pageview',
        action: 'view',
        /* eslint-disable camelcase */
        heading_1: 'intro',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
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
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('File a travel reimbursement claim')).to.exist;
    expect($('va-link-action[text="Start a mileage-only claim"]')).to.exist;

    fireEvent.click($('va-link-action[text="Start a mileage-only claim"]'));
    expect(onStartSpy.called).to.be.true;
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
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
      reducers: reducer,
    });

    expect(
      screen.getByText(
        'We’re sorry, we can’t access your appointment details right now',
      ),
    ).to.exist;
    expect($('va-link-action[text="Start a mileage only claim"]')).to.not.exist;
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
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('We need to wait to file your claim')).to.exist;
    expect($('va-link-action[text="Start a mileage only claim"]')).to.not.exist;
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
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('Your appointment happened more than 30 days ago'))
      .to.exist;
    expect($('va-link-action[text="Start a mileage only claim"]')).to.not.exist;
  });

  it('should hide entry point if claim exists for appointment', () => {
    MockDate.set('2025-01-05');
    renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
        travelPay: {
          appointment: {
            isLoading: true,
            error: null,
            data: {
              ...mockAppt,
              isPast: true,
              daysSinceAppt: 6,
              isOutOfBounds: false,
              travelPayClaim: {
                claim: {},
              },
            },
          },
        },
      },
      reducers: reducer,
    });

    expect($('va-link-action[text="Start a mileage-only claim"]')).to.not.exist;
  });

  it('should hide entry point if appointment is community care (isCC)', () => {
    MockDate.set('2025-01-05');
    renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
        travelPay: {
          appointment: {
            isLoading: true,
            error: null,
            data: {
              ...mockAppt,
              isPast: true,
              daysSinceAppt: 6,
              isOutOfBounds: false,
              isCC: true,
            },
          },
        },
      },
      reducers: reducer,
    });

    expect($('va-link-action[text="Start a mileage-only claim"]')).to.not.exist;
  });
});
