/**
 * Type definitions for the Redux state structure in the dispute-debt application
 * 
 * This represents the state at the time App.tsx is rendered, combining:
 * - App-specific reducers (form, availableDebts, vapService)
 * - Platform-wide common reducers (user, scheduledDowntime, etc.)
 */

import type {
  GlobalState,
  UserState,
  ScheduledDowntimeState,
} from '../../../config/globalTypes/global-state';

/**
 * Complete state for dispute-debt app - extends GlobalState with app-specific state
 */
export interface DisputeDebtGlobalState extends GlobalState {
  // App-specific state (dispute-debt)
  form: FormState;
  availableDebts: AvailableDebtsState;
  vapService: VAPServiceState;
}

/**
 * Dispute-debt app state - only includes state we actually access in this app
 * Uses Pick to select only the properties we need from DisputeDebtGlobalState
 */
export type DisputeDebtState = Pick<
  DisputeDebtGlobalState,
  | 'form'
  | 'availableDebts'
  | 'vapService'
  | 'user'
  | 'scheduledDowntime'
>;

/**
 * Form state from platform/forms/save-in-progress
 * Created by createSaveInProgressFormReducer
 */
/**
 * Form state - only typing the property we actually access
 * Other properties exist in the form system but we don't use them here
 */
export interface FormState {
  data?: FormData;
}


/**
 * Form data structure - the actual form values
 * Additional fields are allowed but not typed here
 */
export interface FormData {
  selectedDebts?: SelectedDebt[];
  veteran?: VeteranFormData;
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
}

/**
 * Phone data structure
 */
export interface PhoneData {
  areaCode?: string;
  phoneNumber?: string;
  extension?: string;
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

// Platform state types are imported from config/globalTypes/global-state.d.ts

/**
 * VAP Service state - we don't access this in dispute-debt
 * From @@vap-svc/reducers
 * Minimal typing since we don't use it
 */
export type VAPServiceState = Record<string, string | number | boolean>;
