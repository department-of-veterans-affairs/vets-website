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

  it('should render items', () => {
    const screen = setup();
    const successfulList = screen.getAllByTestId(
      'medication-requested-successful',
    );
    const failedList = screen.getAllByTestId('medication-requested-failed');
    expect(successfulList.length + failedList.length).to.eq(6);
  });

  it('All refill requests have failed', async () => {
    const screen = setup(
      initRefillStatus,
      [],
      [refillableList[3], refillableList[4], refillableList[5]],
    );

    const failedAlert = screen.getByTestId('failed-refill');
    const errorAlert = screen.getByTestId('error-refill');
    const partialAlert = screen.getByTestId('partial-refill');
    const successAlert = screen.getByTestId('success-refill');

    expect(failedAlert).to.have.attribute('visible', 'false');
    expect(errorAlert).to.have.attribute('visible', 'true');
    expect(partialAlert).to.have.attribute('visible', 'false');
    expect(successAlert).to.have.attribute('visible', 'false');
  });

  it('Part of the refill requests are successful', () => {
    const screen = setup();

    const failedAlert = screen.getByTestId('failed-refill');
    const errorAlert = screen.getByTestId('error-refill');
    const partialAlert = screen.getByTestId('partial-refill');
    const successAlert = screen.getByTestId('success-refill');

    expect(failedAlert).to.have.attribute('visible', 'false');
    expect(errorAlert).to.have.attribute('visible', 'false');
    expect(partialAlert).to.have.attribute('visible', 'true');
    expect(successAlert).to.have.attribute('visible', 'true');
  });

  it('All refill requests are successful', () => {
    const screen = setup(
      initRefillStatus,
      [refillableList[0], refillableList[1], refillableList[2]],
      [],
    );

    const failedAlert = screen.getByTestId('failed-refill');
    const errorAlert = screen.getByTestId('error-refill');
    const partialAlert = screen.getByTestId('partial-refill');
    const successAlert = screen.getByTestId('success-refill');

    expect(failedAlert).to.have.attribute('visible', 'false');
    expect(errorAlert).to.have.attribute('visible', 'false');
    expect(partialAlert).to.have.attribute('visible', 'false');
    expect(successAlert).to.have.attribute('visible', 'true');
  });

  it('The request was not submitted', () => {
    const screen = setup(initRefillStatus, [], []);

    const failedAlert = screen.getByTestId('failed-refill');
    const errorAlert = screen.getByTestId('error-refill');
    const partialAlert = screen.getByTestId('partial-refill');
    const successAlert = screen.getByTestId('success-refill');

    expect(failedAlert).to.have.attribute('visible', 'true');
    expect(errorAlert).to.have.attribute('visible', 'false');
    expect(partialAlert).to.have.attribute('visible', 'false');
    expect(successAlert).to.have.attribute('visible', 'false');
  });
});
