import { expect } from 'chai';
import {
  mockApiRequest,
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import reducer from '../../reducers';
import prescriptions from '../fixtures/prescriptions.json';
import Prescriptions from '../../containers/Prescriptions';
import { medicationsUrls } from '../../util/constants';

describe('Medications Prescriptions container', () => {
  const initialState = {
    rx: {
      prescriptions: {
        prescriptionsList: prescriptions,
        prescriptionsPagination: {
          currentPage: 1,
          totalPages: 7,
          totalEntries: 122,
        },
        prescriptionDetails: {
          prescriptionId: 1234567890,
        },
        apiError: false,
      },
      breadcrumbs: {
        list: [
          { url: medicationsUrls.MEDICATIONS_ABOUT },
          { label: 'About medications' },
        ],
      },
      allergies: { error: true },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<Prescriptions />, {
      initialState: state,
      reducers: reducer,
      path: '/',
    });
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

  it('should display loading message when loading prescriptions', async () => {
    const screen = setup({
      rx: {
        prescriptions: {
          prescriptionsList: undefined,
          prescriptionsPagination: undefined,
        },
        breadcrumbs: {
          list: [
            { url: medicationsUrls.MEDICATIONS_ABOUT },
            { label: 'About medications' },
          ],
        },
        allergies: { error: true },
      },
    });
    waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).to.exist;
      expect(screen.getByText('Loading your medications...')).to.exist;
    });
  });

  it('displays intro text ', async () => {
    const screen = setup();
    expect(
      await screen.findByText(
        'Refill and track your VA prescriptions. And review all medications in your VA medical records.',
      ),
    );
  });

  it('shows title ', async () => {
    const screen = setup();
    expect(await screen.findByTestId('list-page-title')).to.exist;
  });

  it('displays empty list alert', () => {
    const mockData = [];
    resetFetch();
    mockApiRequest(mockData);
    const screen = renderWithStoreAndRouter(<Prescriptions />, {
      initialState: {
        rx: {
          prescriptions: {
            prescriptionsList: [],
            prescriptionsPagination: {
              currentPage: 1,
              totalPages: 1,
              totalEntries: 0,
            },
          },
          breadcrumbs: {
            list: [
              { url: medicationsUrls.MEDICATIONS_ABOUT },
              { label: 'About medications' },
            ],
          },
          allergies: { error: true },
        },
      },
      reducers: reducer,
      path: '/',
    });
    expect(
      screen.getByText(
        'You don’t have any VA prescriptions or medication records',
      ),
    ).to.exist;
  });

  it('should display a clickable download button', () => {
    const mockData = [prescriptions[0]];
    resetFetch();
    mockApiRequest(mockData);
    const screen = renderWithStoreAndRouter(<Prescriptions />, {
      initialState: {
        rx: {
          prescriptions: {
            prescriptionsList: [prescriptions[0]],
            prescriptionsPagination: {
              currentPage: 1,
              totalPages: 1,
              totalEntries: 1,
            },
          },
          breadcrumbs: {
            list: [
              { url: medicationsUrls.MEDICATIONS_ABOUT },
              { label: 'About medications' },
            ],
          },
          allergies: {
            allergiesList: null,
            error: true,
          },
        },
      },
      reducers: reducer,
      path: '/',
    });
    const pdfButton = screen.getByTestId('download-pdf-button');
    fireEvent.click(pdfButton);
    expect(screen);
  });

  it('should show the allergy error alert', () => {
    const screen = renderWithStoreAndRouter(
      <Prescriptions fullList={prescriptions} />,
      {
        initialState: {
          rx: {
            prescriptions: {
              prescriptionsList: [prescriptions[0]],
              prescriptionsPagination: {
                currentPage: 1,
                totalPages: 1,
                totalEntries: 1,
              },
            },
            breadcrumbs: {
              list: [
                { url: medicationsUrls.MEDICATIONS_ABOUT },
                { label: 'About medications' },
              ],
            },
            allergies: {
              allergiesList: null,
              error: true,
            },
          },
        },
        reducers: reducer,
        path: '/',
      },
    );
    expect(
      screen.getByText(
        'When you download medication records, we include a list of your allergies and reactions. But we can’t access your allergy records right now.',
      ),
    ).to.exist;
  });

  it('displays text inside refill box "find a list of prescriptions you can refill online." when refill flag is true', () => {
    const screen = setup({
      ...initialState,
      breadcrumbs: {
        list: [],
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_refill_content: true,
      },
    });
    expect(
      screen.findByText('find a list of prescriptions you can refill online..'),
    );
  });

  it('Simulates print all button click', async () => {
    const screen = setup();
    const button = await screen.findByTestId('download-print-all-button');
    expect(button).to.exist;
    expect(button).to.have.text('Print all medications');
    button.click();
  });

  it('Simulates print button click', async () => {
    const screen = setup();
    const button = await screen.findByTestId('download-print-button');
    expect(button).to.exist;
    expect(button).to.have.text('Print this page of the list');
    button.click();
  });

  it('Simulates primary modal button click', async () => {
    const screen = setup();
    $('va-modal', screen.container).__events.primaryButtonClick();
  });

  it('Simulates secondary modal button click', async () => {
    const screen = setup();
    $('va-modal', screen.container).__events.secondaryButtonClick();
  });
});
