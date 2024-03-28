import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import HealthConditions from '../../containers/HealthConditions';
import conditions from '../fixtures/conditions.json';
import reducer from '../../reducers';
import { convertCondition } from '../../reducers/conditions';
import user from '../fixtures/user.json';

describe('Health conditions list container', () => {
  const initialState = {
    mr: {
      conditions: {
        conditionsList: conditions.map(condition =>
          convertCondition(condition),
        ),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<HealthConditions />, {
      initialState,
      reducers: reducer,
      path: '/conditions',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Health conditions', { exact: true })).to.exist;
  });

  it('displays a page description', () => {
    expect(
      screen.getByText('Health condition records are available', {
        exact: false,
      }),
    ).to.exist;
  });

  it('displays active condition', () => {
    expect(screen.getAllByText('Back pain (SCT 161891005)', { exact: true })).to
      .exist;
  });
});

describe('Health conditions list container still loading', () => {
  it('displays a loading indicator', () => {
    const initialState = {
      user,
      mr: {
        conditions: {},
        alerts: {
          alertList: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <HealthConditions runningUnitTest />,
      {
        initialState,
        reducers: reducer,
        path: '/conditions',
      },
    );

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Health conditions list container with no health conditions', () => {
  it('displays a no health conditions message', () => {
    const initialState = {
      user,
      mr: {
        conditions: {
          conditionsList: [],
        },
        alerts: {
          alertList: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <HealthConditions runningUnitTest />,
      {
        initialState,
        reducers: reducer,
        path: '/conditions',
      },
    );

    expect(
      screen.getByText(
        'There are no health conditions in your VA medical records.',
        {
          exact: false,
        },
      ),
    ).to.exist;
  });
});

describe('Health conditions container with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        conditions: {},
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

    const screen = renderWithStoreAndRouter(<HealthConditions />, {
      initialState,
      reducers: reducer,
      path: '/conditions',
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'We can’t access your health conditions records right now',
          {
            exact: false,
          },
        ),
      ).to.exist;
    });
  });
});

describe('Health conditions list container with no health conditions', () => {
  it('displays a no health conditions message', () => {
    const initialState = {
      user,
      mr: {
        conditions: {
          conditionsList: [],
        },
        alerts: {
          alertList: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<HealthConditions />, {
      initialState,
      reducers: reducer,
      path: '/conditions',
    });

    expect(
      screen.getByText(
        'There are no health conditions in your VA medical records.',
        {
          exact: false,
        },
      ),
    ).to.exist;
  });
});
