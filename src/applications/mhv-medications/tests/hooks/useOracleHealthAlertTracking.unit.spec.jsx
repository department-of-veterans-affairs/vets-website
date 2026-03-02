import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { waitFor, cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { datadogRum } from '@datadog/browser-rum';
import useOracleHealthAlertTracking from '../../hooks/useOracleHealthAlertTracking';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { michiganTransitioningUser } from '../../mocks/api/user';

const ORACLE_HEALTH_CUTOVER_TOGGLE = 'mhv_medications_oracle_health_cutover';

// Transform snake_case API response to camelCase expected by selectors
const mockMigrationSchedules = michiganTransitioningUser.data.attributes.va_profile.oh_migration_info.migration_schedules.map(
  schedule => ({
    ...schedule,
    migrationDate: schedule.migration_date,
    facilities: schedule.facilities.map(facility => ({
      facilityId: facility.facility_id,
      facilityName: facility.facility_name,
    })),
  }),
);

const baseState = {
  user: {
    profile: {
      vaProfile: {
        ohMigrationInfo: {
          migrationSchedules: mockMigrationSchedules,
        },
      },
    },
  },
  featureToggles: {
    [ORACLE_HEALTH_CUTOVER_TOGGLE]: true,
  },
};

/**
 * Creates a mock Redux store with default state
 * @param {Object} overrides - State overrides (deep merged with base state)
 * @returns {Object} Mock Redux store
 */
const createMockStore = (overrides = {}) => {
  const state = {
    ...baseState,
    ...overrides,
    user: {
      ...baseState.user,
      ...overrides.user,
      profile: {
        ...baseState.user.profile,
        ...overrides.user?.profile,
        vaProfile: {
          ...baseState.user.profile.vaProfile,
          ...overrides.user?.profile?.vaProfile,
          ohMigrationInfo: {
            ...baseState.user.profile.vaProfile.ohMigrationInfo,
            ...overrides.user?.profile?.vaProfile?.ohMigrationInfo,
          },
        },
      },
    },
    featureToggles: {
      ...baseState.featureToggles,
      ...overrides.featureToggles,
    },
  };

  return configureStore([])(state);
};

/**
 * Creates a test wrapper with Redux Provider
 * @param {Object} mockStore - The mock Redux store
 * @returns {React.Component} A React component wrapping children with Provider
 */
function createTestWrapper(mockStore) {
  const Wrapper = ({ children }) => (
    <Provider store={mockStore}>{children}</Provider>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return Wrapper;
}

describe('useOracleHealthAlertTracking', () => {
  let sandbox;
  let addActionSpy;

  const defaultOptions = {
    warningActionName:
      dataDogActionNames.oracleHealthTransition.T45_WARNING_ALERT_DISPLAYED,
    errorActionName:
      dataDogActionNames.oracleHealthTransition.T3_ERROR_ALERT_DISPLAYED,
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    addActionSpy = sandbox.spy(datadogRum, 'addAction');
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  describe('return values', () => {
    it('returns migratingFacilities and isOracleHealthCutoverEnabled', () => {
      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(
        () => useOracleHealthAlertTracking(defaultOptions),
        { wrapper },
      );

      expect(result.current.migratingFacilities).to.deep.equal(
        mockMigrationSchedules,
      );
      expect(result.current.isOracleHealthCutoverEnabled).to.be.true;
    });

    it('returns empty array for migratingFacilities when no migration data exists', () => {
      const mockStore = createMockStore({
        user: {
          profile: {
            vaProfile: {
              ohMigrationInfo: { migrationSchedules: [] },
            },
          },
        },
      });
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(
        () => useOracleHealthAlertTracking(defaultOptions),
        { wrapper },
      );

      expect(result.current.migratingFacilities).to.deep.equal([]);
    });
  });

  describe('T45 warning alert tracking', () => {
    it('fires warning Datadog action when migrations are in a warning phase', async () => {
      // Current mock phase is 'p4' — set migration to warning phase 'p1'
      const warningMigrations = [
        {
          ...mockMigrationSchedules[0],
          phases: { ...mockMigrationSchedules[0].phases, current: 'p1' },
        },
      ];

      const mockStore = createMockStore({
        user: {
          profile: {
            vaProfile: {
              ohMigrationInfo: { migrationSchedules: warningMigrations },
            },
          },
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useOracleHealthAlertTracking(defaultOptions), {
        wrapper,
      });

      await waitFor(() => {
        const callArgs = addActionSpy
          .getCalls()
          .find(
            call =>
              call.args[0] ===
              dataDogActionNames.oracleHealthTransition
                .T45_WARNING_ALERT_DISPLAYED,
          );
        expect(callArgs).to.exist;
        expect(callArgs.args[1]).to.have.property('facilityId');
        expect(callArgs.args[1]).to.have.property('phase', 'p1');
      });
    });

    it('does not fire warning action when migrations are in an error phase', async () => {
      // Default mock is phase 'p4' which is an error phase for MEDICATIONS
      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useOracleHealthAlertTracking(defaultOptions), {
        wrapper,
      });

      await waitFor(() => {
        const warningCalls = addActionSpy
          .getCalls()
          .filter(
            call =>
              call.args[0] ===
              dataDogActionNames.oracleHealthTransition
                .T45_WARNING_ALERT_DISPLAYED,
          );
        expect(warningCalls).to.have.length(0);
      });
    });

    it('does not fire warning action when warningActionName is not provided', async () => {
      const warningMigrations = [
        {
          ...mockMigrationSchedules[0],
          phases: { ...mockMigrationSchedules[0].phases, current: 'p1' },
        },
      ];

      const mockStore = createMockStore({
        user: {
          profile: {
            vaProfile: {
              ohMigrationInfo: { migrationSchedules: warningMigrations },
            },
          },
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(
        () =>
          useOracleHealthAlertTracking({
            warningActionName: undefined,
            errorActionName: defaultOptions.errorActionName,
          }),
        { wrapper },
      );

      await waitFor(() => {
        const warningCalls = addActionSpy
          .getCalls()
          .filter(
            call =>
              call.args[0] ===
              dataDogActionNames.oracleHealthTransition
                .T45_WARNING_ALERT_DISPLAYED,
          );
        expect(warningCalls).to.have.length(0);
      });
    });
  });

  describe('T3 error alert tracking', () => {
    it('fires error Datadog action when migrations are in an error phase', async () => {
      // Default mock phase is 'p4' which is an error phase for MEDICATIONS
      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useOracleHealthAlertTracking(defaultOptions), {
        wrapper,
      });

      await waitFor(() => {
        const callArgs = addActionSpy
          .getCalls()
          .find(
            call =>
              call.args[0] ===
              dataDogActionNames.oracleHealthTransition
                .T3_ERROR_ALERT_DISPLAYED,
          );
        expect(callArgs).to.exist;
        expect(callArgs.args[1]).to.have.property('facilityId');
        expect(callArgs.args[1]).to.have.property('phase', 'p4');
      });
    });

    it('does not fire error action when migrations are in a warning phase', async () => {
      const warningMigrations = [
        {
          ...mockMigrationSchedules[0],
          phases: { ...mockMigrationSchedules[0].phases, current: 'p1' },
        },
      ];

      const mockStore = createMockStore({
        user: {
          profile: {
            vaProfile: {
              ohMigrationInfo: { migrationSchedules: warningMigrations },
            },
          },
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useOracleHealthAlertTracking(defaultOptions), {
        wrapper,
      });

      await waitFor(() => {
        const errorCalls = addActionSpy
          .getCalls()
          .filter(
            call =>
              call.args[0] ===
              dataDogActionNames.oracleHealthTransition
                .T3_ERROR_ALERT_DISPLAYED,
          );
        expect(errorCalls).to.have.length(0);
      });
    });

    it('does not fire error action when errorActionName is not provided', async () => {
      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      renderHook(
        () =>
          useOracleHealthAlertTracking({
            warningActionName: defaultOptions.warningActionName,
            errorActionName: undefined,
          }),
        { wrapper },
      );

      await waitFor(() => {
        const errorCalls = addActionSpy
          .getCalls()
          .filter(
            call =>
              call.args[0] ===
              dataDogActionNames.oracleHealthTransition
                .T3_ERROR_ALERT_DISPLAYED,
          );
        expect(errorCalls).to.have.length(0);
      });
    });
  });

  describe('when feature flag is disabled', () => {
    it('does not fire any Datadog actions', async () => {
      const mockStore = createMockStore({
        featureToggles: { [ORACLE_HEALTH_CUTOVER_TOGGLE]: false },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useOracleHealthAlertTracking(defaultOptions), {
        wrapper,
      });

      await waitFor(() => {
        expect(addActionSpy.callCount).to.equal(0);
      });
    });
  });

  describe('when no migration data exists', () => {
    it('does not fire any Datadog actions', async () => {
      const mockStore = createMockStore({
        user: {
          profile: {
            vaProfile: {
              ohMigrationInfo: { migrationSchedules: [] },
            },
          },
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useOracleHealthAlertTracking(defaultOptions), {
        wrapper,
      });

      await waitFor(() => {
        expect(addActionSpy.callCount).to.equal(0);
      });
    });
  });

  describe('facility ID extraction', () => {
    it('includes all facility IDs from matching migrations as strings', async () => {
      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useOracleHealthAlertTracking(defaultOptions), {
        wrapper,
      });

      await waitFor(() => {
        const errorCall = addActionSpy
          .getCalls()
          .find(
            call =>
              call.args[0] ===
              dataDogActionNames.oracleHealthTransition
                .T3_ERROR_ALERT_DISPLAYED,
          );
        expect(errorCall).to.exist;
        const { facilityId } = errorCall.args[1];
        expect(facilityId).to.be.an('array');
        expect(facilityId).to.include('506');
        expect(facilityId).to.include('515');
        expect(facilityId).to.include('553');
        expect(facilityId).to.include('585');
      });
    });
  });
});
