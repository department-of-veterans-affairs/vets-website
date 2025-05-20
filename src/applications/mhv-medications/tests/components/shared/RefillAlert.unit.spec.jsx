import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RefillAlert from '../../../components/shared/RefillAlert';
import reducer from '../../../reducers';

describe('Alert if refill is taking longer than expected', () => {
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
  const initialState = {
    rx: {
      prescriptions: {
        refillAlertList,
      },
    },
  };
  const setup = () => {
    return renderWithStoreAndRouter(<RefillAlert />, {
      initialState,
      reducers: reducer,
      path: '/',
    });
  };

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
