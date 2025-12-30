/**
 * Type definitions for the Redux state structure in the dispute-debt application
 * 
 * This represents the state at the time App.tsx is rendered, combining:
 * - App-specific reducers (form, availableDebts, vapService)
 * - Platform-wide common reducers (user, scheduledDowntime, etc.)
 */

export interface DisputeDebtState {
  // App-specific state
  form: FormState;
  availableDebts: AvailableDebtsState;
  vapService: VAPServiceState;

  // Platform-wide common state
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
 * Form state from platform/forms/save-in-progress
 * Created by createSaveInProgressFormReducer
 */
export interface FormState {
  data?: FormData;
  pages?: Record<string, PageState>;
  initialData?: FormData;
  savedStatus?: string;
  autoSavedStatus?: string;
  loadedStatus?: string;
  prefillStatus?: string;
  isStartingOver?: boolean;
  lastSavedDate?: string | null;
  expirationDate?: string | null;
  inProgressFormId?: string | null;
  loadedData?: {
    formData: FormData;
    metadata?: Record<string, unknown>;
  };
  version?: string;
  formId?: string;
  disableSave?: boolean;
  migrations?: unknown[];
  prefillTransformer?: unknown;
  trackingPrefix?: string;
  additionalRoutes?: unknown[];
}

/**
 * Page state structure
 */
export interface PageState {
  [key: string]: unknown;
}

/**
 * Form data structure - the actual form values
 */
export interface FormData {
  selectedDebts?: SelectedDebt[];
  veteran?: VeteranFormData;
  [key: string]: unknown; // Additional form fields
}

/**
 * Selected debt with dispute information
 */
export interface SelectedDebt extends Debt {
  disputeReason?: string;
  supportStatement?: string;
}

/**
 * Veteran form data structure
 */
export interface VeteranFormData {
  dateOfBirth?: string;
  email?: string;
  ssn?: string;
  fileNumber?: string;
  fullName?: {
    first?: string;
    middle?: string;
    last?: string;
    suffix?: string;
  };
  mailingAddress?: AddressData;
  mobilePhone?: PhoneData;
}

/**
 * Address data structure
 */
export interface AddressData {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  stateCode?: string;
  zipCode?: string;
  zipCodeSuffix?: string;
  countryName?: string;
  [key: string]: unknown;
}

/**
 * Phone data structure
 */
export interface PhoneData {
  areaCode?: string;
  phoneNumber?: string;
  extension?: string;
  [key: string]: unknown;
}

/**
 * Available Debts state
 * From dispute-debt/reducers/index.js
 */
export interface AvailableDebtsState {
  isDebtPending?: boolean;
  availableDebts: Debt[];
  isDebtError: boolean;
  debtError: string;
}

/**
 * Debt object structure
 * Based on the simplified response from fetchDebts action
 */
export interface Debt {
  id: number;
  compositeDebtId: string;
  label: string;
  description: string;
  debtType: string;
  deductionCode: string;
  currentAr: number;
  originalAr: number;
  benefitType: string;
  rcvblId: string;
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
    errors: unknown | null;
    loading: boolean;
    termsAndConditionsAccepted: boolean;
    messagingSignature: string | null;
  };
  vapContactInfo: Record<string, unknown>;
  savedForms: Array<{ form: string; [key: string]: unknown }>;
  prefillsAvailable: string[];
  loading: boolean;
  services: string[];
  session: Record<string, unknown>;
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
  [key: string]: unknown;
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
  [key: string]: unknown;
}

/**
 * VAP Service state
 * From @@vap-svc/reducers
 */
export interface VAPServiceState {
  [key: string]: unknown;
}

/**
 * Platform state types - these are less critical for dispute-debt app
 * but included for completeness. Can be expanded as needed.
 */

export interface AnnouncementsState {
  [key: string]: unknown;
}

export interface HeaderMenuState {
  [key: string]: unknown;
}

export interface ExternalServiceStatusesState {
  [key: string]: unknown;
}

export interface FeatureTogglesState {
  [toggleName: string]: boolean | unknown;
}

export interface DrupalStaticDataState {
  [key: string]: unknown;
}

export interface NavigationState {
  [key: string]: unknown;
}

export interface LayoutState {
  [key: string]: unknown;
}

export interface MegaMenuState {
  [key: string]: unknown;
}

export interface I18State {
  [key: string]: unknown;
}
