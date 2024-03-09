import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import prescriptions from '../fixtures/prescriptions.json';
import Prescriptions from '../../containers/Prescriptions';

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
      },
      breadcrumbs: {
        list: [
          { url: '/my-health/medications/about' },
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
            { url: '/my-health/medications/about' },
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
              { url: '/my-health/medications/about' },
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
        'You don’t have any medications in your medications list',
      ),
    ).to.exist;
  });

  it('should display a clickable download button', () => {
    const mockData = [prescriptions[0]];
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
              { url: '/my-health/medications/about' },
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
                { url: '/my-health/medications/about' },
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
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_refill_content: true,
      },
    });
    expect(
      screen.findByText('find a list of prescriptions you can refill online..'),
    );
  });
});
