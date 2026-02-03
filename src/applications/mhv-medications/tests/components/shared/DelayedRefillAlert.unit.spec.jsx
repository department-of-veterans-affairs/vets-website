import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import DelayedRefillAlert from '../../../components/shared/DelayedRefillAlert';
import reducer from '../../../reducers';

const refillAlertList = [
  {
    prescriptionId: 123456,
    prescriptionName: 'Test name 1',
  },
  {
    prescriptionId: 234567,
    prescriptionName: 'Test name 2',
  },
];

// Test data for V2 API response format where only `id` is available
// TODO: Remove this test data after vets-api PR #26244 is deployed
const refillAlertListWithIdOnly = [
  {
    id: '345678',
    prescriptionName: 'V2 API Test name 1',
  },
  {
    id: '456789',
    prescriptionName: 'V2 API Test name 2',
  },
];

const setup = (alertList = refillAlertList) => {
  return renderWithStoreAndRouterV6(
    <DelayedRefillAlert refillAlertList={alertList} />,
    {
      initialState: {
        rx: {
          refillAlertList: alertList,
          showRefillProgressContent: true,
        },
      },
      reducers: reducer,
    },
  );
};

let sandbox;

describe('Alert if refill is taking longer than expected', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
    screen.getByTestId('rxDelay-alert-message');
  });

  it('lists prescriptions that are running late', () => {
    const screen = setup();

    expect(
      screen.getByTestId(
        `refill-alert-link-${refillAlertList[0].prescriptionId}`,
      ),
    );
    expect(
      screen.getByTestId(
        `refill-alert-link-${refillAlertList[1].prescriptionId}`,
      ),
    );
  });

  // Test for V2 API fallback where only `id` is available (not `prescriptionId`)
  // TODO: Remove this test after vets-api PR #26244 is deployed
  it('falls back to id when prescriptionId is not available (V2 API workaround)', () => {
    const screen = setup(refillAlertListWithIdOnly);

    expect(
      screen.getByTestId(
        `refill-alert-link-${refillAlertListWithIdOnly[0].id}`,
      ),
    );
    expect(
      screen.getByTestId(
        `refill-alert-link-${refillAlertListWithIdOnly[1].id}`,
      ),
    );
  });
});
