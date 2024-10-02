import { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { usePrevious } from '~/platform/utilities/react-hooks';
import {
  isAuthenticatedWithOAuth,
  signInServiceName,
} from '~/platform/user/authentication/selectors';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import {
  createIsServiceAvailableSelector,
  isLOA3 as isLOA3Selector,
  isMultifactorEnabled as isMultifactorEnabledSelector,
} from '~/platform/user/selectors';
import backendServices from '~/platform/user/profile/constants/backendServices';

import { getIsBlocked } from '../selectors';
import {
  saveDirectDeposit,
  toggleDirectDepositEdit,
} from '../actions/directDeposit';

export const useDirectDeposit = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});

  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const editButtonRef = useRef();

  const cancelButtonRef = useRef();

  // Determine if the form has unsaved edits for any of the fields
  const hasUnsavedFormEdits = useMemo(
    () =>
      !!(
        formData?.accountType ||
        formData?.routingNumber ||
        formData?.accountNumber
      ),
    [formData],
  );

  const {
    ui,
    paymentAccount,
    controlInformation,
    saveError,
    loadError,
  } = useSelector(state => state.directDeposit);

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

  // Determine if the user has verified their identity
  // by checking if they are using an eligible sign-in service,
  // have an LOA3 profile, and have multifactor enabled
  const isIdentityVerified = useMemo(
    () => isUsingEligibleSignInService && isLOA3 && isMultifactorEnabled,
    [isLOA3, isMultifactorEnabled, isUsingEligibleSignInService],
  );

  // based on user.icn.present? && user.participant_id.present? in vets-api policy
  const isLighthouseAvailable = useSelector(
    createIsServiceAvailableSelector(backendServices.LIGHTHOUSE),
  );

  // function to exit the direct deposit update view
  // also will clear any pending form data in UI
  const exitUpdateView = useCallback(
    () => {
      setFormData({});
      dispatch(toggleDirectDepositEdit(false));
    },
    [setFormData, dispatch],
  );

  // function to handle the cancel button click
  // on direct deposit update form
  const onCancel = useCallback(
    () => {
      if (hasUnsavedFormEdits) {
        setShowCancelModal(true);
        return;
      }

      exitUpdateView();
    },
    [hasUnsavedFormEdits, setShowCancelModal, exitUpdateView],
  );

  const onFormSubmit = useCallback(
    () => {
      const payload = {
        paymentAccount: {
          accountType: formData.accountType,
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber,
        },
      };
      dispatch(saveDirectDeposit(payload));
    },
    [dispatch, formData],
  );

  const {
    canUpdateDirectDeposit,
    isCorpAvailable,
    isEduClaimAvailable,
  } = controlInformation || { canUpdateDirectDeposit: false };

  const hasEligibleControlInformation =
    canUpdateDirectDeposit && (isCorpAvailable || isEduClaimAvailable);

  return {
    ui: useMemo(() => ui, [ui]),
    loadError,
    saveError,
    paymentAccount: useMemo(() => paymentAccount, [paymentAccount]),
    controlInformation: useMemo(() => controlInformation, [controlInformation]),
    showUpdateSuccess,
    setShowUpdateSuccess,
    showCancelModal,
    setShowCancelModal,
    isIdentityVerified,
    useOAuth,
    isBlocked,
    formData,
    onFormSubmit,
    setFormData,
    editButtonRef,
    cancelButtonRef,
    onCancel,
    exitUpdateView,
    wasSaving,
    wasEditing,
    hasUnsavedFormEdits,
    isEligible:
      isLighthouseAvailable &&
      isIdentityVerified &&
      hasEligibleControlInformation,
  };
};
