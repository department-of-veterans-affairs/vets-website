/**
 * Global Redux state type definitions
 * 
 * This represents the complete state structure that the platform creates,
 * including all platform-wide common reducers that are added to every app's store.
 * 
 * Individual applications should create their own state types by picking
 * only the properties they actually use from GlobalState.
 */

/**
 * Global Redux state type - includes all platform reducers that exist in the store
 * This represents the complete state structure that the platform creates
 * 
 * Individual applications should extend this with their app-specific state
 */
export interface GlobalState {
  // Platform-wide common state (added by platform/startup/store.js)
  user: UserState;
  scheduledDowntime: ScheduledDowntimeState;
  announcements: AnnouncementsState;
  headerMenuReducer: HeaderMenuState;
  externalServiceStatuses: ExternalServiceStatusesState;
  featureToggles: FeatureTogglesState;
  drupalStaticData: DrupalStaticDataState;
  navigation: NavigationState;
  layout: LayoutState;
  megaMenu: MegaMenuState;
  i18State: I18State;
}

/**
 * User state from platform/user
 * Contains login and profile sub-reducers
 */
export interface UserState {
  login: LoginState;
  profile: ProfileState;
}

/**
 * Login state
 * From platform/user/authentication/reducers
 */
export interface LoginState {
  currentlyLoggedIn: boolean;
  hasCheckedKeepAlive: boolean;
}

/**
 * Profile state
 * From platform/user/profile/reducers
 */
export interface ProfileState {
  userFullName: {
    first: string | null;
    middle: string | null;
    last: string | null;
    suffix: string | null;
  };
  preferredName: string | null;
  createdAt: string | null;
  email: string | null;
  dob: string | null;
  gender: string | null;
  accountType: string | null;
  accountUuid: string | null;
  isCernerPatient: boolean;
  loa: {
    current: number | null;
    highest: number | null;
  };
  verified: boolean;
  mhvAccount: {
    accountLevel: string | null;
    accountState: string | null;
    errors: Error | null;
    loading: boolean;
    termsAndConditionsAccepted: boolean;
    messagingSignature: string | null;
  };
  vapContactInfo: Record<string, string | number | boolean>;
  savedForms: Array<{ form: string }>;
  prefillsAvailable: string[];
  loading: boolean;
  services: string[];
  session: Record<string, string | number | boolean>;
  mhvTransitionEligible: boolean;
  userAtPretransitionedOhFacility: boolean;
  userFacilityReadyForInfoAlert: boolean;
  errors: boolean;
}

/**
 * Scheduled Downtime state
 * From platform/monitoring/DowntimeNotification/reducer
 */
export interface ScheduledDowntimeState {
  globalDowntime: GlobalDowntime | null;
  isReady: boolean;
  isPending: boolean;
  serviceMap: ServiceMap | null;
  dismissedDowntimeWarnings: string[];
}

/**
 * Global downtime information
 */
export interface GlobalDowntime {
  startTime: string | Date;
  endTime: string | Date;
}

/**
 * Service map - maps external service names to downtime information
 */
export interface ServiceMap {
  [serviceName: string]: ServiceDowntimeInfo;
}

/**
 * Service downtime information
 */
export interface ServiceDowntimeInfo {
  externalService: string;
  startTime: string | Date;
  endTime: string | Date | null;
  description?: string;
}

/**
 * Platform state types - minimal typing for state that may not be used by all apps
 */

export interface AnnouncementsState {
  isInitialized: boolean;
  dismissed: string[];
}

export type HeaderMenuState = Record<string, string | number | boolean>;
export type ExternalServiceStatusesState = Record<string, string | number | boolean>;
export type FeatureTogglesState = Record<string, string | number | boolean>;
export type DrupalStaticDataState = Record<string, string | number | boolean>;
export type NavigationState = Record<string, string | number | boolean>;
export type LayoutState = Record<string, string | number | boolean>;
export type MegaMenuState = Record<string, string | number | boolean>;
export type I18State = Record<string, string | number | boolean>;
