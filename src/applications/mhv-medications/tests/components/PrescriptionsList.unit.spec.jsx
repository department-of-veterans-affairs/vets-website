import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import * as uniqueUserMetrics from '~/platform/mhv/unique_user_metrics';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';
import PrescriptionsList from '../../components/PrescriptionsList';
import { rxListSortingOptions } from '../../util/constants';

let sandbox;
let logUniqueUserMetricsEventsStub;

const mockPrescriptionsData = {
  prescriptions: [
    {
      prescriptionId: 1,
      prescriptionName: 'Test Medication',
      dispStatus: 'Active',
      sortedDispensedDate: '2023-01-01',
      refillRemaining: 3,
    },
  ],
  pagination: {
    totalPages: 1,
  },
};

describe('PrescriptionsList Component', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    logUniqueUserMetricsEventsStub = sandbox.stub(
      uniqueUserMetrics,
      'logUniqueUserMetricsEvents',
    );

    // Mock the API hook
    sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns({
        data: mockPrescriptionsData,
        error: null,
        isLoading: false,
        isFetching: false,
      });
  });

  afterEach(() => {
    sandbox.restore();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      sortOption: rxListSortingOptions.alphabeticalOrder,
      ...props,
    };

    return renderWithStoreAndRouterV6(<PrescriptionsList {...defaultProps} />, {
      initialState: {},
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByTestId('prescriptions-list')).to.exist;
  });

  it('logs PRESCRIPTIONS_ACCESSED when prescriptions are successfully displayed', async () => {
    const screen = setup();

    // Wait for the prescriptions list to be displayed
    await screen.findByTestId('prescriptions-list');

    // Wait for async operations to complete and verify logging was called
    await waitFor(() => {
      expect(
        logUniqueUserMetricsEventsStub.calledWith(
          uniqueUserMetrics.EVENT_REGISTRY.PRESCRIPTIONS_ACCESSED,
        ),
      ).to.be.true;
    });
  });

  it('does not log when there is an error', async () => {
    // Mock error state
    sandbox.restore();
    sandbox = sinon.createSandbox();
    logUniqueUserMetricsEventsStub = sandbox.stub(
      uniqueUserMetrics,
      'logUniqueUserMetricsEvents',
    );

    sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns({
        data: null,
        error: { message: 'API Error' },
        isLoading: false,
        isFetching: false,
      });

    setup();

    // Wait a bit to ensure no logging occurs
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(logUniqueUserMetricsEventsStub.called).to.be.false;
  });

  it('does not log when still loading', async () => {
    // Mock loading state
    sandbox.restore();
    sandbox = sinon.createSandbox();
    logUniqueUserMetricsEventsStub = sandbox.stub(
      uniqueUserMetrics,
      'logUniqueUserMetricsEvents',
    );

    sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns({
        data: null,
        error: null,
        isLoading: true,
        isFetching: false,
      });

    setup();

    // Wait a bit to ensure no logging occurs
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(logUniqueUserMetricsEventsStub.called).to.be.false;
  });
});
