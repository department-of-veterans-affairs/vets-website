import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import * as recordEventModule from 'platform/monitoring/record-event';

import reducer from '../../redux/reducer';
import SubmitFlowWrapper from '../../containers/SubmitFlowWrapper';

const mockAppt = {
  start: '2024-12-03T14:00:00Z',
  localStartTime: '2024-12-03T08:00:00.000-06:00',
  isPast: true,
  daysSinceAppt: null,
  isOutOfBounds: false,
  location: {
    id: '983',
    type: 'appointments',
    attributes: {
      name: 'Cheyenne VA Medical Center',
    },
  },
  travelPayClaim: {
    metadata: {
      status: 200,
      success: true,
      message: 'Data retrieved successfully',
    },
  },
};

describe('SubmitFlowWrapper', () => {
  const oldLocation = global.window.location;
  let recordEventStub;

  const getData = ({
    areFeatureTogglesLoading = true,
    hasFeatureFlag = true,
    hasClaimDetailsFeatureFlag = true,
    canSubmitClaim = true,
    appointmentError = false,
  } = {}) => {
    return {
      featureToggles: {
        loading: areFeatureTogglesLoading,
        /* eslint-disable camelcase */
        travel_pay_power_switch: hasFeatureFlag,
        travel_pay_view_claim_details: hasClaimDetailsFeatureFlag,
        travel_pay_submit_mileage_expense: canSubmitClaim,
        /* eslint-enable camelcase */
      },
      travelPay: {
        appointment: {
          isLoading: false,
          error: appointmentError
            ? { errors: [{ title: 'Service unavilable', status: 500 }] }
            : null,
          data: appointmentError ? null : mockAppt,
        },
      },
    };
  };

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
    global.window.location = {
      replace: sinon.spy(),
    };
  });

  afterEach(() => {
    recordEventStub.restore();
    global.window.location = oldLocation;
  });

  it('should redirect if feature flag is off', () => {
    renderWithStoreAndRouter(<SubmitFlowWrapper />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        canSubmitClaim: false,
      }),
      path: `/claims/12345`,
      reducers: reducer,
    });
    expect(window.location.replace.called).to.be.true;
  });

  it('should render loading state if feature flag is loading', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <SubmitFlowWrapper />,
      {
        initialState: getData(),
        path: `/claims/12345`,
        reducers: reducer,
      },
    );
    expect(screenFeatureToggle.getByTestId('travel-pay-loading-indicator')).to
      .exist;
  });

  it('should not render link to file if error getting appointment data', async () => {
    const screen = renderWithStoreAndRouter(<SubmitFlowWrapper />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        appointmentError: true,
      }),
      path: `/claims/`,
      reducers: reducer,
    });

    expect(
      screen.getByText(/we can’t access your appointment details right now/i),
    ).to.exist;
    expect($('va-alert[status="error"]')).to.exist;
    expect($('va-link-action[text="File a mileage-only claim"]')).to.not.exist;
  });

  it('should record GA event if back to appointment link is clicked', async () => {
    renderWithStoreAndRouter(<SubmitFlowWrapper />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
      }),
      path: `/claims/`,
      reducers: reducer,
    });

    fireEvent.click($('va-link[text="Back to your appointment"]'));
    expect(
      recordEventStub.calledWith({
        event: 'smoc-questions',
        label: 'intro',
        'option-label': 'abandon',
      }),
    ).to.be.true;
  });
});
