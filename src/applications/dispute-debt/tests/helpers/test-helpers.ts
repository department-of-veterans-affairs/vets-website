/**
 * Shared test helpers for dispute-debt unit tests
 * 
 * Provides utilities for creating mock stores and state based on GlobalState
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - platform-forms-system is a JavaScript module without TypeScript types
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../config/form';
import type { DisputeDebtState, FormState } from '../../types/state';
import type { GlobalState } from '../../../../../config/globalTypes/global-state';
import type { AppLocation } from '../../../../../config/globalTypes/router-types.d';

/**
 * Creates a base GlobalState with default values
 * Used as the foundation for all mock stores
 */
export const createBaseGlobalState = (): GlobalState => ({
  user: {
    login: {
      currentlyLoggedIn: false,
      hasCheckedKeepAlive: false,
    },
    profile: {
      verified: false,
      savedForms: [],
      prefillsAvailable: [],
      loa: { current: 3, highest: 3 },
      dob: '2000-01-01',
      userFullName: { first: null, middle: null, last: null, suffix: null },
      preferredName: null,
      createdAt: null,
      email: null,
      gender: null,
      accountType: null,
      accountUuid: null,
      isCernerPatient: false,
      mhvAccount: {
        accountLevel: null,
        accountState: null,
        errors: null,
        loading: false,
        termsAndConditionsAccepted: false,
        messagingSignature: null,
      },
      vapContactInfo: {},
      loading: false,
      services: [],
      session: {},
      mhvTransitionEligible: false,
      userAtPretransitionedOhFacility: false,
      userFacilityReadyForInfoAlert: false,
      errors: false,
    },
  },
  scheduledDowntime: {
    globalDowntime: null,
    isReady: true,
    isPending: false,
    serviceMap: null,
    dismissedDowntimeWarnings: [],
  },
  announcements: { isInitialized: false, dismissed: [] },
  headerMenuReducer: {},
  externalServiceStatuses: {},
  featureToggles: {},
  drupalStaticData: {},
  navigation: {},
  layout: {},
  megaMenu: {},
  i18State: {},
});

/**
 * Creates a mock Redux store for testing
 * @param state - Partial state to override defaults
 * @returns Mock store with getState, subscribe, and dispatch
 */
export const createMockStore = (state: Partial<DisputeDebtState> = {}) => ({
  getState: (): DisputeDebtState => ({
    ...createBaseGlobalState(),
    availableDebts: {
      isDebtPending: false,
      availableDebts: [],
      isDebtError: false,
      debtError: '',
    },
    form: {
      ...(createInitialState(formConfig) as FormState),
      ...(state.form || {}),
    },
    vapService: {},
    ...state,
  } as DisputeDebtState),
  subscribe: () => {},
  dispatch: () => {},
});

/**
 * Creates a mock AppLocation for testing
 * @param overrides - Partial location to override defaults
 * @returns Mock AppLocation object
 */
export const createMockLocation = (overrides: Partial<AppLocation> = {}): AppLocation => ({
  pathname: '/introduction',
  search: '',
  hash: '',
  state: undefined,
  key: 'test',
  ...overrides,
} as AppLocation);
