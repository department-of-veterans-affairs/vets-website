import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import * as prescriptionsApiModule from '../../../api/prescriptionsApi';
import RefillAlert from '../../../components/shared/RefillAlert';
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
const setup = () => {
  return renderWithStoreAndRouterV6(<RefillAlert />, {
    initialState: {},
    reducers: reducer,
    additionalMiddlewares: [prescriptionsApiModule.prescriptionsApi.middleware],
  });
};
let sandbox;

describe('Alert if refill is taking longer than expected', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox
      .stub(prescriptionsApiModule, 'useGetRefillAlertPrescriptionsQuery')
      .returns({
        data: {
          prescriptions: refillAlertList,
          meta: {},
        },
        error: undefined,
        isLoading: false,
        isFetching: false,
      });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
    screen.getByText('Some refills are taking longer than expected');
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
});
