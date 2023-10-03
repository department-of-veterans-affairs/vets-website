import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/react';
import Vitals from '../../containers/Vitals';
import reducer from '../../reducers';
import vitals from '../fixtures/vitals.json';
import { convertVital } from '../../reducers/vitals';

describe('Vitals list container', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalsList: vitals.entry.map(item => convertVital(item.resource)),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vitals />, {
      initialState,
      reducers: reducer,
      path: '/vitals',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Vitals', { exact: true })).to.exist;
  });

  it('displays a subheading', () => {
    expect(
      screen.getByText(
        'Vitals are basic health numbers your providers check at your appointments.',
        {
          exact: true,
        },
      ),
    ).to.exist;
  });

  it('displays two types of records', async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId('record-list-item').length).to.eq(2);
    });
  });
});
