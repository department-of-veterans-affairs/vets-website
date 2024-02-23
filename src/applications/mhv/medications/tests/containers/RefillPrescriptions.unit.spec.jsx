import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import RefillPrescriptions from '../../containers/RefillPrescriptions';
import reducer from '../../reducers';
import prescriptions from '../fixtures/refillablePrescriptionsList.json';
import { dateFormat } from '../../util/helpers';

describe('RefillPrescriptions', () => {
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medications_display_refill_content: true,
    },
    user: {
      login: {
        currentlyLoggedIn: true,
      },
    },
  };

  const setup = (
    state = initialState,
    list = prescriptions,
    isLoadingList = false,
  ) => {
    return renderWithStoreAndRouter(
      <RefillPrescriptions refillList={list} isLoadingList={isLoadingList} />,
      {
        initialState: state,
        reducers: reducer,
        path: '/refill',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should render loading state', async () => {
    const screen = setup(initialState, [], true);
    waitFor(() => {
      expect(screen.findByTestId('loading-indicator')).to.exist;
      expect(screen.findByText('Loading')).to.exist;
    });
  });

  it('Shows h1 and h2', async () => {
    const screen = setup();
    const title = await screen.findByTestId('refill-page-title');
    expect(title).to.exist;
    expect(title).to.have.text('Refill prescriptions');
    const subtitle = await screen.findByTestId('refill-page-subtitle');
    expect(subtitle).to.exist;
    expect(subtitle).to.have.text('Ready to refill');
  });

  it('Shows the request refill button', async () => {
    const screen = setup();
    const button = await screen.findByTestId('request-refill-button');
    expect(button).to.exist;
    expect(button).to.have.property('text', 'Request refills');
    button.click();
  });

  it('Shows the select all button', async () => {
    const screen = setup();
    const button = await screen.findByTestId('select-all-button');
    expect(button).to.exist;
    expect(button).to.have.property('text', 'Select all');
    button.click();
  });

  it('Clicks the details page link', async () => {
    const screen = setup();
    const link = await screen.findByTestId('medication-details-page-link-0');
    fireEvent.click(link);
  });

  it('Clicks the medications list page link', async () => {
    const screen = setup();
    const link = await screen.findByTestId('medications-page-link');
    fireEvent.click(link);
  });

  it('Shows the correct "last filled on" date for refill', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId('refill-last-filled-0');
    expect(lastFilledEl).to.exist;
    expect(lastFilledEl).to.have.text(
      `Last filled on: ${dateFormat(prescriptions[0].dispensedDate)}`,
    );
  });

  it('Shows the correct "last filled on" date (w/rxRfRecords) for refill', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId(`refill-last-filled-5`);
    expect(lastFilledEl).to.exist;
    const rx = prescriptions.find(
      ({ prescriptionId }) => prescriptionId === 22217099,
    );
    expect(lastFilledEl).to.have.text(
      `Last filled on: ${dateFormat(rx.rxRfRecords[0][1][0].dispensedDate)}`,
    );
  });

  it('Shows the correct last filled on date for renew', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId('renew-last-filled-0');
    expect(lastFilledEl).to.exist;
    expect(lastFilledEl).to.have.text(
      `Last filled on: ${dateFormat(prescriptions[1].dispensedDate)}`,
    );
  });

  it('Shows the correct "last filled on" date (w/rxRfRecords) for renew', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId(`renew-last-filled-1`);
    expect(lastFilledEl).to.exist;
    const rx = prescriptions.find(
      ({ prescriptionId }) => prescriptionId === 22217089,
    );
    expect(lastFilledEl).to.have.text(
      `Last filled on: ${dateFormat(rx.rxRfRecords[0][1][0].dispensedDate)}`,
    );
  });

  it('Checks the checkbox for first prescription', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
  });

  it('Unchecks the checkbox for first prescription', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
    checkbox.click();
  });

  it('Shows the correct text for one prescription', async () => {
    const screen = setup(initialState, [prescriptions[0]]);
    const countEl = await screen.findByTestId('refill-page-list-count');
    expect(countEl).to.exist;
    expect(countEl).to.have.text('You have 1 prescription ready to refill.');
  });

  it('Shows the correct text for 2 prescriptions', async () => {
    const screen = setup(initialState, [prescriptions[1], prescriptions[1]]);
    const countEl = await screen.findByTestId('renew-page-list-count');
    expect(countEl).to.exist;
    expect(countEl).to.have.text(
      'Showing 2 prescriptions you may need to renew',
    );
  });

  it('Completes api request with selected prescriptions', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
    const button = await screen.findByTestId('request-refill-button');
    button.click();
  });
});
