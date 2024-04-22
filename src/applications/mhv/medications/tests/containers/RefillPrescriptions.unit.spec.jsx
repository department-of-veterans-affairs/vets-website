import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import {
  mockApiRequest,
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import RefillPrescriptions from '../../containers/RefillPrescriptions';
import reducer from '../../reducers';
import prescriptions from '../fixtures/refillablePrescriptionsList.json';
import { dateFormat } from '../../util/helpers';
import prescriptionsList from '../fixtures/prescriptionsList.json';

describe('Refill Prescriptions Component', () => {
  const initialState = {
    rx: {
      prescriptions: {
        selectedSortOption: 'alphabeticallyByStatus',
      },
      breadcrumbs: {
        list: [
          {
            url: '/my-health/medications/about',
            label: 'About medications',
          },
        ],
      },
      allergies: {},
    },
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

  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

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

  it('Shows 404 page if feature toggle is disabled', async () => {
    const screen = setup(
      {
        ...initialState,
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_medications_display_refill_content: false,
        },
      },
      [],
      true,
    );
    waitFor(() => {
      expect(screen.getByText('Sorry — we can’t find that page')).to.exist;
    });
  });

  it('Mocks API Request', async () => {
    resetFetch();
    mockApiRequest(prescriptionsList);
    const screen = setup();
    const title = await screen.findByTestId('refill-page-title');
    expect(title).to.exist;
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
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
    expect(button).to.have.property('text', 'Request 1 refill');
    button.click();
  });

  it('Shows the select all checkbox', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId('select-all-checkbox');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.property('label', 'Select all');
    checkbox.click();
  });

  it('Shows the correct "last filled on" date for refill', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId('refill-last-filled-0');
    expect(lastFilledEl).to.exist;
    expect(lastFilledEl).to.have.text(
      `Last filled on ${dateFormat(prescriptions[0].dispensedDate)}`,
    );
  });

  it('Shows the correct "last filled on" date (w/rxRfRecords) for refill', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId(`refill-last-filled-6`);
    expect(lastFilledEl).to.exist;
    const rx = prescriptions.find(
      ({ prescriptionId }) => prescriptionId === 22217099,
    );
    expect(lastFilledEl).to.have.text(
      `Last filled on ${dateFormat(rx.rxRfRecords[0]?.dispensedDate)}`,
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

  it('Completes api request with selected prescriptions', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
    const button = await screen.findByTestId('request-refill-button');
    button.click();
  });

  it('Shows h1 and note if no prescriptions are refillable', async () => {
    const screen = setup(initialState, []);
    const title = await screen.findByTestId('refill-page-title');
    expect(title).to.exist;
    expect(title).to.have.text('Refill prescriptions');
    expect(
      screen.getByText(
        'You don’t have any VA prescriptions with refills available. If you need a prescription, contact your care team.',
      ),
    ).to.exist;
  });
});
