import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/react';
import Vitals from '../../containers/Vitals';
import reducer from '../../reducers';
import vitals from '../fixtures/vitals.json';
import { convertVital } from '../../reducers/vitals';
import user from '../fixtures/user.json';

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

  it('displays four types of records', async () => {
    await waitFor(() => {
      // count doubled due to print view
      expect(screen.getAllByTestId('record-list-item').length).to.eq(8);
    });
  });
});

describe('Vitals list container with errors', () => {
  const initialState = {
    user,
    mr: {
      vitals: {},
      alerts: {
        alertList: [
          {
            datestamp: '2023-10-10T16:03:28.568Z',
            isActive: true,
            type: 'error',
          },
          {
            datestamp: '2023-10-10T16:03:28.572Z',
            isActive: true,
            type: 'error',
          },
        ],
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

  it('displays an error', async () => {
    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your vitals records right now', {
          exact: false,
        }),
      ).to.exist;
    });
  });
});

describe('Vitals list container with no vitals', () => {
  const initialState = {
    user,
    mr: {
      vitals: {
        vitalsList: [],
      },
      alerts: {
        alertList: [],
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

  it('displays a no vitals message', () => {
    expect(
      screen.getByText('There are no vitals in your VA medical records.', {
        exact: true,
      }),
    ).to.exist;
  });
});
