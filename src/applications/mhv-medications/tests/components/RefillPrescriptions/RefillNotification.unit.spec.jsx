import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import RefillNotification from '../../../components/RefillPrescriptions/RefillNotification';
import reducer from '../../../reducers';
import refillableList from '../../fixtures/refillablePrescriptionsList.json';

describe('Refill Notification Component', () => {
  const initSuccessfulMeds = [
    refillableList[0],
    refillableList[1],
    refillableList[2],
  ];
  const initFailedMeds = [
    refillableList[3],
    refillableList[4],
    refillableList[5],
  ];
  const initRefillStatus = 'finished';

  const setup = (
    refillStatus = initRefillStatus,
    successfulMeds = initSuccessfulMeds,
    failedMeds = initFailedMeds,
  ) => {
    return renderWithStoreAndRouterV6(
      <RefillNotification
        refillStatus={refillStatus}
        successfulMeds={successfulMeds}
        failedMeds={failedMeds}
      />,
      {
        initialState: {},
        reducers: reducer,
        initialEntries: ['/refill'],
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('All refill requests are failed', async () => {
    const screen = setup(
      initRefillStatus,
      [],
      [refillableList[3], refillableList[4], refillableList[5]],
    );
    const failedList = screen.getAllByTestId('medication-requested-failed');
    expect(failedList.length).to.eq(3);
    expect(screen.getByText('Request not submitted')).to.exist;
  });

  it('Part of the refill requests are successful', () => {
    const screen = setup();
    expect(screen.getByText('Only part of your request was submitted')).to
      .exist;
    expect(screen.getByText('Refills requested')).to.exist;
  });

  it('should render items', () => {
    const screen = setup();
    const successfulList = screen.getAllByTestId(
      'medication-requested-successful',
    );
    const failedList = screen.getAllByTestId('medication-requested-failed');
    expect(successfulList.length + failedList.length).to.eq(6);
  });

  it('All refill requests are successful', () => {
    const screen = setup(
      initRefillStatus,
      [refillableList[0], refillableList[1], refillableList[2]],
      [],
    );
    expect(
      screen.getByText(
        'To check the status of your refill requests, go to your medications list and filter by "recently requested."',
      ),
    ).to.exist;
    expect(screen.getByText('Go to your medications list')).to.exist;
    const successfulList = screen.getAllByTestId(
      'medication-requested-successful',
    );
    expect(successfulList.length).to.eq(3);
  });
});
