import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import HealthConditions from '../../containers/HealthConditions';
import conditions from '../fixtures/conditions.json';
import acceleratedConditions from '../fixtures/conditionsAccelerating.json';
import reducer from '../../reducers';
import {
  convertCondition,
  convertUnifiedCondition,
} from '../../reducers/conditions';
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

describe('HealthConditions does not flash NoRecordsMessage before data loads', () => {
  it('does not show NoRecordsMessage when conditionsList is undefined', () => {
    const initialState = {
      user,
      mr: {
        conditions: {
          conditionsList: undefined, // Data not yet fetched
        },
        alerts: { alertList: [] },
      },
    };

    const screen = renderWithStoreAndRouter(<HealthConditions />, {
      initialState,
      reducers: reducer,
      path: '/conditions',
    });

    // Should NOT show the no records message when data is undefined
    expect(
      screen.queryByText(
        'There are no health conditions in your VA medical records.',
        { exact: false },
      ),
    ).to.not.exist;
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
  const cernerUser = {
    profile: {
      ...user.profile,
      facilities: [{ facilityId: '757' }],
    },
  };

  const setUpState = ({
    isAcceleratingConditions = false,
    conditionsArray = [],
    loadState = loadStates.LOADED,
  }) => {
    return {
      featureToggles: {
        /* eslint-disable camelcase */
        mhv_accelerated_delivery_enabled: true,
        mhv_accelerated_delivery_conditions_enabled: isAcceleratingConditions,
        /* eslint-enable camelcase */
        loading: false,
      },
      drupalStaticData: {
        vamcEhrData: {
          loading: false,
          data: {
            cernerFacilities: isAcceleratingConditions
              ? [
                  {
                    vhaId: '757',
                    vamcFacilityName:
                      'Chalmers P. Wylie Veterans Outpatient Clinic',
                    vamcSystemName: 'VA Central Ohio health care',
                    ehr: 'cerner',
                  },
                ]
              : [],
          },
        },
      },
      user: isAcceleratingConditions ? cernerUser : user,
      mr: {
        conditions: {
          conditionsList: conditionsArray,
          listState: loadState,
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
  };

  describe('when isAcceleratingConditions is false', () => {
    it('should show NewRecordsIndicator and standard condition list', () => {
      const screen = renderWithStoreAndRouter(<HealthConditions />, {
        initialState: setUpState({
          loadState: loadStates.FETCHING,
        }),
        reducers: reducer,
        path: '/conditions',
      });

      // Should not show accelerated loading indicator
      expect(screen.queryByTestId('accelerated-loading-indicator')).to.not
        .exist;
      // Should show the NewRecordsIndicator
      expect(screen.getByTestId('new-records-indicator-wrapper')).to.exist;
      expect(screen.getByText('Health conditions')).to.exist;
    });
  });

  describe('when isAcceleratingConditions is true', () => {
    it('should not show NewRecordsIndicator when accelerating conditions', () => {
      const screen = renderWithStoreAndRouter(<HealthConditions />, {
        initialState: setUpState({
          isAcceleratingConditions: true,
          conditionsArray: acceleratedConditions.data.map(condition =>
            convertUnifiedCondition(condition),
          ),
        }),
        reducers: reducer,
        path: '/conditions',
      });

      // NewRecordsIndicator should not be rendered when isAcceleratingConditions is true
      expect(screen.queryByTestId('new-records-indicator-wrapper')).to.not
        .exist;
      expect(screen.getByText('Health conditions')).to.exist;
    });

    it('should show accelerated loading indicator when fetching', () => {
      const screen = renderWithStoreAndRouter(<HealthConditions />, {
        initialState: setUpState({
          isAcceleratingConditions: true,
          loadState: loadStates.FETCHING,
        }),
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

describe('Health conditions global isLoading states', () => {
  const baseState = {
    user,
    mr: {
      conditions: {
        conditionsList: [],
        listState: loadStates.IDLE,
      },
      alerts: { alertList: [] },
    },
  };

  it('renders TrackedSpinner when feature toggles are loading', () => {
    const initialState = {
      ...baseState,
      featureToggles: { loading: true },
      drupalStaticData: { vamcEhrData: { loading: false } },
    };
    const screen = renderWithStoreAndRouter(<HealthConditions />, {
      initialState,
      reducers: reducer,
      path: '/conditions',
    });
    expect(screen.queryByTestId('accelerated-loading-indicator')).to.exist;
  });

  it('renders TrackedSpinner when Drupal EHR data is loading', () => {
    const initialState = {
      ...baseState,
      featureToggles: { loading: false },
      drupalStaticData: { vamcEhrData: { loading: true } },
    };
    const screen = renderWithStoreAndRouter(<HealthConditions />, {
      initialState,
      reducers: reducer,
      path: '/conditions',
    });
    expect(screen.queryByTestId('accelerated-loading-indicator')).to.exist;
  });
});
