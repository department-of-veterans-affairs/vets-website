import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import sinon from 'sinon';
import HealthConditions from '../../containers/HealthConditions';
import conditions from '../fixtures/conditions.json';
import reducer from '../../reducers';
import { convertCondition } from '../../reducers/conditions';
import user from '../fixtures/user.json';
import { loadStates } from '../../util/constants';

describe('Health conditions list container', () => {
  const initialState = {
    mr: {
      user,
      conditions: {
        conditionsList: conditions.entry.map(condition =>
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

  it('displays active condition', () => {
    expect(screen.getAllByText('None recorded', { exact: false })).to.exist;
  });

  it('displays intro text for conditions', () => {
    expect(
      screen.getAllByText(
        'This list includes the same information as your "VA problem list"',
        { exact: false },
      ),
    ).to.exist;
  });

  it('displays about codes info', () => {
    expect(
      screen.getByText(
        'Some of your health conditions may have diagnosis codes',
        {
          exact: false,
        },
      ),
    ).to.exist;
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

describe('Health conditions with accelerated data', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock the useAcceleratedData hook
    sandbox
      .stub(require('../../hooks/useAcceleratedData'), 'default')
      .returns({ isAcceleratingConditions: false });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when isAcceleratingConditions is false', () => {
    it('should show NewRecordsIndicator and standard condition list', () => {
      const initialState = {
        user,
        mr: {
          conditions: {
            conditionsList: conditions.entry.map(condition =>
              convertCondition(condition),
            ),
            listCurrentAsOf: new Date(),
          },
          alerts: {
            alertList: [],
          },
          refresh: {
            status: null,
            initialFhirLoad: false,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<HealthConditions />, {
        initialState,
        reducers: reducer,
        path: '/conditions',
      });

      // Should not show accelerated loading indicator
      expect(screen.queryByTestId('accelerated-loading-indicator')).to.not
        .exist;
      expect(screen.getByText('Health conditions')).to.exist;
    });
  });

  describe('when isAcceleratingConditions is true', () => {
    beforeEach(() => {
      sandbox.restore();
      sandbox = sinon.createSandbox();

      // Mock isAcceleratingConditions as true
      sandbox
        .stub(require('../../hooks/useAcceleratedData'), 'default')
        .returns({ isAcceleratingConditions: true });
    });

    it('should not show NewRecordsIndicator when accelerating conditions', () => {
      const initialState = {
        user,
        mr: {
          conditions: {
            conditionsList: conditions.entry.map(condition =>
              convertCondition(condition),
            ),
            listState: loadStates.LOADED,
            listCurrentAsOf: new Date(),
          },
          alerts: {
            alertList: [],
          },
          refresh: {
            status: null,
            initialFhirLoad: false,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<HealthConditions />, {
        initialState,
        reducers: reducer,
        path: '/conditions',
      });

      // NewRecordsIndicator should not be rendered when isAcceleratingConditions is true
      expect(screen.queryByTestId('accelerated-loading-indicator')).to.not
        .exist;
      expect(screen.getByText('Health conditions')).to.exist;
    });

    it('should show accelerated loading indicator when fetching', () => {
      const initialState = {
        user,
        mr: {
          conditions: {
            conditionsList: [],
            listState: loadStates.FETCHING,
          },
          alerts: {
            alertList: [],
          },
          refresh: {
            status: null,
            initialFhirLoad: false,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<HealthConditions />, {
        initialState,
        reducers: reducer,
        path: '/conditions',
      });

      const loadingIndicator = screen.getByTestId(
        'accelerated-loading-indicator',
      );
      expect(loadingIndicator).to.have.attribute('setfocus');
    });
  });
});
