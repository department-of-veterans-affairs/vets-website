import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import conditions from '../fixtures/conditions.json';
import reducer from '../../reducers';
import { convertCondition } from '../../reducers/conditions';
import user from '../fixtures/user.json';
import { loadStates } from '../../util/constants';

const mockUseAcceleratedData = sinon.stub();
mockUseAcceleratedData.returns({
  isAcceleratingConditions: false,
  isLoading: false,
});

const useAcceleratedDataModule = {
  __esModule: true,
  default: mockUseAcceleratedData,
};

const hookPath = require.resolve('../../hooks/useAcceleratedData');
require.cache[hookPath] = {
  id: hookPath,
  filename: hookPath,
  loaded: true,
  exports: useAcceleratedDataModule,
};

const HealthConditions = require('../../containers/HealthConditions').default;

describe('Health conditions with accelerated data', () => {
  describe('when isAcceleratingConditions is false', () => {
    beforeEach(() => {
      // Change the return value without re-stubbing
      mockUseAcceleratedData.returns({
        isAcceleratingConditions: false,
        isLoading: false,
      });
    });

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
      // Change the return value without re-stubbing
      mockUseAcceleratedData.returns({
        isAcceleratingConditions: true,
        isLoading: false,
      });
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
      expect(screen.queryByTestId('new-records-loading-indicator')).to.not
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
