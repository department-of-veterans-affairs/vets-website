import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import RefillNotification from '../../../components/RefillPrescriptions/RefillNotification';
import refillableList from '../../fixtures/refillablePrescriptionsList.json';

describe('RefillNotification', () => {
  const initSuccessfulMeds = refillableList.slice(0, 3);
  const initFailedMeds = refillableList.slice(3, 6);
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
        reducers: {},
        initialEntries: ['/refill'],
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should display error message when refill request fails', () => {
    const screen = setup(initRefillStatus, [], initFailedMeds);

    expect(screen.getByTestId('error-refill-title')).to.include.text(
      'Request not submitted',
    );
    expect(screen.getByTestId('error-refill-description')).to.include.text(
      'We’re sorry. There’s a problem with our system.',
    );
    expect(screen.getByTestId('error-refill-suggestion')).to.include.text(
      'Try requesting your refills again. If it still doesn’t work, contact your VA pharmacy.',
    );
  });

  it('should display error message when refill request is not submitted', () => {
    const screen = setup(initRefillStatus, [], []);

    expect(screen.getByTestId('error-refill-title')).to.include.text(
      'Request not submitted',
    );
    expect(screen.getByTestId('error-refill-description')).to.include.text(
      'We’re sorry. There’s a problem with our system.',
    );
    expect(screen.getByTestId('error-refill-suggestion')).to.include.text(
      'Try requesting your refills again. If it still doesn’t work, contact your VA pharmacy.',
    );
  });

  it('should display partial success message when some refill requests fail', () => {
    const screen = setup(initRefillStatus, initSuccessfulMeds, initFailedMeds);

    expect(screen.getByTestId('partial-refill-title')).to.include.text(
      'Only part of your request was submitted',
    );
    expect(screen.getByTestId('partial-refill-description')).to.include.text(
      'We’re sorry. There’s a problem with our system. We couldn’t submit these refill requests:',
    );
    expect(screen.getByTestId('failed-medication-list')).to.exist;
    expect(screen.getByTestId('partial-refill-suggestion')).to.include.text(
      'Try requesting these refills again. If it still doesn’t work, call your VA pharmacy.',
    );
    expect(screen.getByTestId('success-refill-title')).to.include.text(
      'Refills requested',
    );
    expect(screen.getByTestId('successful-medication-list')).to.exist;
    expect(screen.getByTestId('success-refill-description')).to.include.text(
      'To check the status of your refill requests, go to your medications list and filter by "recently requested."',
    );
    expect(screen.getByTestId('back-to-medications-page-link')).to.exist;
  });
});
