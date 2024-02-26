import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import RenewablePrescriptions from '../../../components/RefillPrescriptions/RenewablePrescriptions';
import reducer from '../../../reducers';
import prescriptions from '../../fixtures/refillablePrescriptionsList.json';
import { dateFormat } from '../../../util/helpers';

describe('Renew Prescriptions Component', () => {
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

  const setup = (state = initialState, list = prescriptions) => {
    const rxList = list
      .slice()
      .filter(rx => rx.dispStatus === 'Active' && rx.refillRemaining === 0)
      .sort((a, b) => a.prescriptionName.localeCompare(b.prescriptionName));
    return renderWithStoreAndRouter(
      <RenewablePrescriptions renewablePrescriptionsList={rxList} />,
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

  it('Clicks the medications list page link', async () => {
    const screen = setup();
    const link = await screen.findByTestId('medications-page-link');
    fireEvent.click(link);
  });

  it('Clicks the details page link', async () => {
    const screen = setup();
    const link = await screen.findByTestId('medication-details-page-link-0');
    fireEvent.click(link);
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

  it('Shows the correct last filled on date for renew', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId('renew-last-filled-1');
    expect(lastFilledEl).to.exist;
    const rx = prescriptions
      .slice()
      .sort((a, b) => a.prescriptionName.localeCompare(b.prescriptionName))
      .find(
        ({ refillRemaining, dispStatus, dispensedDate }) =>
          dispStatus === 'Active' &&
          refillRemaining === 0 &&
          dispensedDate !== null,
      );
    expect(lastFilledEl).to.have.text(
      `Last filled on: ${dateFormat(rx.dispensedDate)}`,
    );
  });

  it('Shows the correct "last filled on" date (w/rxRfRecords) for renew', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId(`renew-last-filled-0`);
    screen.debug();
    expect(lastFilledEl).to.exist;
    const rx = prescriptions.find(
      ({ prescriptionId }) => prescriptionId === 22217089,
    );
    expect(lastFilledEl).to.have.text(
      `Last filled on: ${dateFormat(rx.rxRfRecords[0][1][0].dispensedDate)}`,
    );
  });

  it('Shows the correct text for 1 prescription', async () => {
    const screen = setup(initialState, [prescriptions[1]]);
    const countEl = await screen.findByTestId('renew-page-list-count');
    expect(countEl).to.exist;
    expect(countEl).to.have.text(
      'Showing 1 prescription you may need to renew',
    );
  });

  it('Shows the correct text for 2 prescriptions', async () => {
    const screen = setup(initialState, [prescriptions[1], prescriptions[1]]);
    const countEl = await screen.findByTestId('renew-page-list-count');
    expect(countEl).to.exist;
    expect(countEl).to.have.text(
      'Showing 2 prescriptions you may need to renew',
    );
  });

  it('Simulates page change in VaPagination to page 2', async () => {
    const screen = setup(undefined, new Array(25).fill(prescriptions[1]));
    const pagination = await $('va-pagination', screen.container);
    const event = new CustomEvent('pageSelect', {
      bubbles: true,
      detail: { page: 2 },
    });
    pagination.dispatchEvent(event);
  });
});
