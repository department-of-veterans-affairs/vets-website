import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import Vitals from '../../containers/Vitals';
import reducer from '../../reducers';
import vitals from '../fixtures/vitals.json';
import { convertVital } from '../../reducers/vitals';

describe('Vaccines list container', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalsList: vitals.entry.map(item => convertVital(item.resource)),
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<Vitals />, {
      initialState: state,
      reducers: reducer,
      path: '/vitals',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Vitals', { exact: true })).to.exist;
  });

  it('displays a subheading', () => {
    const screen = setup();
    expect(
      screen.getByText('Review vitals in your VA medical records.', {
        exact: false,
      }),
    ).to.exist;
  });

  it('displays two types of records', async () => {
    await waitFor(() => {
      const screen = setup();
      expect(screen.getAllByTestId('record-list-item').length).to.eq(2);
    });
  });
});
