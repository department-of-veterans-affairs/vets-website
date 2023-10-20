import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
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
          { url: '/my-health/about-medications' },
          { label: 'About Medications' },
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

  it('displays intro text ', async () => {
    const screen = setup();
    expect(
      await screen.getByText(
        'Refill and track your VA prescriptions. And review all medications in your VA medical records.',
      ),
    );
  });

  it('shows title ', async () => {
    const screen = setup();
    expect(await screen.queryByTestId('list-page-title')).to.exist;
  });
});
