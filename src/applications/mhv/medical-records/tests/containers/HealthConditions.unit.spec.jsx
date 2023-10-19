import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
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
  const initialState = {
    user,
    mr: {
      conditions: {},
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<HealthConditions runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/conditions',
    });
  });

  it('displays a loading indicator', () => {
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Health conditions list container with no health conditions', () => {
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

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<HealthConditions runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/conditions',
    });
  });

  it('displays a no health conditions message', () => {
    expect(
      screen.getByText('You don’t have any records in Health conditions', {
        exact: true,
      }),
    ).to.exist;
  });
});
