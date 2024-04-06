import { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  isAuthenticatedWithOAuth,
  signInServiceName,
} from '~/platform/user/authentication/selectors';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { usePrevious } from '~/platform/utilities/react-hooks';
import {
  isLOA3 as isLOA3Selector,
  isMultifactorEnabled as isMultifactorEnabledSelector,
} from '~/platform/user/selectors';

import {
  getIsBlocked,
  selectHasDirectDepositLoadError,
  selectHasDirectDepositSaveError,
} from '../selectors';

/**
 * @typedef {Object} DirectDepositHookResult
 * @property {Object} ui - UI-related state for direct deposit.
 * @property {boolean} ui.isEditing - Indicates if the direct deposit form is being edited.
 * @property {boolean} ui.isSaving - Indicates if the direct deposit form is being saved.
 * @property {Object|null} loadError - Error object for loading direct deposit information.
 * @property {Object|null} saveError - Error object for saving direct deposit information.
 * @property {boolean} hasLoadError - Indicates if there is a load error for direct deposit form.
 * @property {boolean} hasSaveError - Indicates if there is a save error for direct deposit form.
 * @property {Object} paymentAccount - Payment account information.
 * @property {string} paymentAccount.name - Name associated with the payment account.
 * @property {string} paymentAccount.accountType - Type of the payment account.
 * @property {string} paymentAccount.accountNumber - Account number of the payment account.
 * @property {string} paymentAccount.routingNumber - Routing number of the payment account.
 * @property {ControlInformation} controlInformation - Control information for direct deposit.
 * @property {boolean} controlInformation.canUpdateDirectDeposit - Indicates if the user can update direct deposit information.
 * @property {boolean} controlInformation.isCorpAvailable - Indicates if the corporate database is available.
 * @property {boolean} controlInformation.isEduClaimAvailable - Indicates if the education claim is available.
 * @property {boolean} controlInformation.isCorpRecFound - Indicates if the corporate record is found.
 * @property {boolean} controlInformation.hasNoBdnPayments - Indicates if there are no BDN payments.
 * @property {boolean} controlInformation.hasIdentity - Indicates if the user's identity is verified.
 * @property {boolean} controlInformation.hasIndex - Indicates if the user has an index.
 * @property {boolean} controlInformation.isCompetent - Indicates if the user is competent.
 * @property {boolean} controlInformation.hasMailingAddress - Indicates if the user has a mailing address.
 * @property {boolean} controlInformation.hasNoFiduciaryAssigned - Indicates if no fiduciary is assigned to the user.
 * @property {boolean} controlInformation.isNotDeceased - Indicates if the user is not deceased.
 * @property {boolean} controlInformation.hasPaymentAddress - Indicates if the user has a payment address.
 * @property {boolean} showUpdateSuccess - State for the success alert after saving the form.
 * @property {function} setShowUpdateSuccess - Function to set the state for the success alert.
 * @property {boolean} isIdentityVerified - Indicates if the user's identity is verified based on several conditions.
 * @property {boolean} useOAuth - Indicates if OAuth authentication is used.
 * @property {boolean} isBlocked - Indicates if the user is blocked from viewing the page based on control information.
 * @property {Object} formData - Main state where direct deposit form data is stored.
 * @property {function} setFormData - Function to set the state for form data.
 * @property {React.MutableRefObject<undefined>} editButtonRef - Ref for form edit button.
 * @property {React.MutableRefObject<undefined>} cancelButtonRef - Ref for form cancel button.
 * @property {boolean} wasSaving - Previous value of `ui.isSaving`.
 * @property {boolean} wasEditing - Previous value of `ui.isEditing`.
 */

/**
 * Custom hook for managing direct deposit functionality.
 * This hook is used to manage the state and logic for the direct deposit form
 * and related components
 *
 * @returns {DirectDepositHookResult} An object containing various state variables and functions related to direct deposit.
 */
export const useDirectDeposit = () => {
  /**
   * Main state where direct deposit form data is stored.
   *
   * @type {Object} formD
   */
  const [formData, setFormData] = useState({});

  /**
   * State for the success alert after saving the form.
   *
   * @type {boolean}
   */
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  /**
   * Ref for form edit button.
   *
   * @type {React.MutableRefObject<undefined>}
   */
  const editButtonRef = useRef();

  /**
   * Ref for form cancel button.
   *
   * @type {React.MutableRefObject<undefined>}
   */
  const cancelButtonRef = useRef();

  /**
   * Redux state for direct deposit form.
   *
   * @type {DirectDepositState}
   */
  const {
    ui,
    paymentAccount,
    controlInformation,
    saveError,
    loadError,
  } = useSelector(state => state.directDeposit);

  /**
   * Indicates if there is a load error for direct deposit form.
   *
   * @type {boolean}
   */
  const hasLoadError = useSelector(selectHasDirectDepositLoadError);

  /**
   * Indicates if there is a save error for direct deposit form.
   *
   * @type {boolean}
   */
  const hasSaveError = useSelector(selectHasDirectDepositSaveError);

  /**
   * Previous value of `ui.isSaving`.
   *
   * @type {boolean}
   */
  const wasSaving = usePrevious(ui.isSaving);

  /**
   * Previous value of `ui.isEditing`.
   *
   * @type {boolean}
   */
  const wasEditing = usePrevious(ui.isEditing);

  /**
   * Indicates if OAuth authentication is used.
   *
   * @type {boolean}
   */
  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  /**
   * Indicates if the user is blocked from viewing the page based on control information.
   *
   * @type {boolean}
   */
  const isBlocked = getIsBlocked(controlInformation);

  /**
   * Sign-in service name.
   *
   * @type {string}
   */
  const signInService = useSelector(signInServiceName);

  /**
   * Indicates if an eligible sign-in service is being used.
   *
   * @type {boolean}
   */
  const isUsingEligibleSignInService =
    signInService &&
    new Set([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV]).has(signInService);

  /**
   * Indicates if the user has LOA3 access.
   *
   * @type {boolean}
   */
  const isLOA3 = useSelector(isLOA3Selector);

  /**
   * Indicates if multifactor authentication is enabled.
   *
   * @type {boolean}
   */
  const isMultifactorEnabled = useSelector(isMultifactorEnabledSelector);

  /**
   * Indicates if the user's identity is verified based on several conditions.
   *
   * @type {boolean}
   */
  const isIdentityVerified = useMemo(
    () => isUsingEligibleSignInService && isLOA3 && isMultifactorEnabled,
    [isLOA3, isMultifactorEnabled, isUsingEligibleSignInService],
  );

  return {
    ui: useMemo(() => ui, [ui]),
    loadError,
    saveError,
    hasLoadError,
    hasSaveError,
    paymentAccount: useMemo(() => paymentAccount, [paymentAccount]),
    controlInformation: useMemo(() => controlInformation, [controlInformation]),
    showUpdateSuccess,
    setShowUpdateSuccess,
    isIdentityVerified,
    useOAuth,
    isBlocked,
    formData,
    setFormData,
    editButtonRef,
    cancelButtonRef,
    wasSaving,
    wasEditing,
  };
};
