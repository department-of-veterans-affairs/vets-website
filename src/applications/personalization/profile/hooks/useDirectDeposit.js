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

export const useDirectDeposit = () => {
  const [formData, setFormData] = useState({});

  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  const editButtonRef = useRef();

  const cancelButtonRef = useRef();

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
  const wasEditing = usePrevious(ui.isEditing);

  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  const isBlocked = getIsBlocked(controlInformation);

  const signInService = useSelector(signInServiceName);

  const isUsingEligibleSignInService =
    signInService &&
    new Set([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV]).has(signInService);

  const isLOA3 = useSelector(isLOA3Selector);

  const isMultifactorEnabled = useSelector(isMultifactorEnabledSelector);

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
