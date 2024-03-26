import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { has } from 'lodash';
import {
  isAuthenticatedWithOAuth,
  signInServiceName,
} from '~/platform/user/authentication/selectors';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { usePrevious } from '~/platform/utilities/react-hooks';
import { focusElement } from '~/platform/utilities/ui';
import {
  isLOA3 as isLOA3Selector,
  isMultifactorEnabled as isMultifactorEnabledSelector,
} from '~/platform/user/selectors';

import { DIRECT_DEPOSIT_ALERT_SETTINGS } from '../constants';

const getIsBlocked = controlInformation => {
  if (!controlInformation) return false;

  const propertiesToCheck = [
    'isCompetent',
    'hasNoFiduciaryAssigned',
    'isNotDeceased',
  ];

  // if any flag is false, the user is blocked
  // but first we have to determine if that particular flag property exists
  return propertiesToCheck.some(
    flag => has(controlInformation, flag) && !controlInformation[flag],
  );
};

export const useDirectDeposit = () => {
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [formIsDirty, setFormIsDirty] = useState(false);

  // redux state for direct deposit form
  const { ui, error, paymentAccount, controlInformation } = useSelector(
    state => state.directDeposit,
  );

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

  // page setup effects
  useEffect(() => {
    focusElement('[data-focus-target]');
    document.title = `Direct Deposit Information | Veterans Affairs`;
  }, []);

  // effects to trigger the success alert
  useEffect(
    () => {
      if (!ui.isSaving && !error && wasSaving) {
        setShowUpdateSuccess(true);
        removeBankInfoUpdatedAlert();
      }
    },
    [wasSaving, ui.isSaving, error, removeBankInfoUpdatedAlert],
  );

  // effect to show an alert when the form is dirty and navigating away
  useEffect(
    () => {
      const handleBeforeUnload = event => {
        if (formIsDirty) {
          event.preventDefault();
          // eslint-disable-next-line no-param-reassign
          event.returnValue = '';
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    },
    [formIsDirty],
  );

  return {
    ui: useMemo(() => ui, [ui]),
    error: useMemo(() => error, [error]),
    paymentAccount: useMemo(() => paymentAccount, [paymentAccount]),
    controlInformation: useMemo(() => controlInformation, [controlInformation]),
    formIsDirty,
    setFormIsDirty,
    showUpdateSuccess,
    isIdentityVerified,
    useOAuth,
    isBlocked,
  };
};
