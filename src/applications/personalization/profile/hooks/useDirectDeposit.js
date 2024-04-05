import { useCallback, useEffect, useMemo, useState } from 'react';
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

import { DIRECT_DEPOSIT_ALERT_SETTINGS } from '../constants';
import {
  getIsBlocked,
  selectHasDirectDepositLoadError,
  selectHasDirectDepositSaveError,
} from '../selectors';

export const useDirectDeposit = () => {
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  // redux state for direct deposit form
  const {
    ui,
    paymentAccount,
    controlInformation,
    saveError,
    loadError,
  } = useSelector(state => state.directDeposit);

  const hasLoadError = useSelector(selectHasDirectDepositLoadError);
  const hasSaveError = useSelector(selectHasDirectDepositSaveError);

  const wasSaving = usePrevious(ui.isSaving);

  // redux state for access information
  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  // check for control information to block a user from viewing the page
  const isBlocked = getIsBlocked(controlInformation);

  // conditions to show the verify identity alert
  const signInService = useSelector(signInServiceName);
  const isUsingEligibleSignInService =
    signInService &&
    new Set([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV]).has(signInService);
  const isLOA3 = useSelector(isLOA3Selector);
  const isMultifactorEnabled = useSelector(isMultifactorEnabledSelector);

  // combine all several conditions to show the verify identity alert and hide the bank info / form
  const isIdentityVerified = useMemo(
    () => isUsingEligibleSignInService && isLOA3 && isMultifactorEnabled,
    [isLOA3, isMultifactorEnabled, isUsingEligibleSignInService],
  );

  const removeBankInfoUpdatedAlert = useCallback(() => {
    setTimeout(() => {
      setShowUpdateSuccess(false);
    }, DIRECT_DEPOSIT_ALERT_SETTINGS.TIMEOUT);
  }, []);

  // effects to trigger the success alert
  useEffect(
    () => {
      if (!ui.isSaving && !hasSaveError && wasSaving) {
        setShowUpdateSuccess(true);
        removeBankInfoUpdatedAlert();
      }
    },
    [wasSaving, ui.isSaving, hasSaveError, removeBankInfoUpdatedAlert],
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
    isIdentityVerified,
    useOAuth,
    isBlocked,
    formData,
    setFormData,
  };
};
