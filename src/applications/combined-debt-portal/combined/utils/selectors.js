import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { useParams } from 'react-router-dom';
import { getCopayDetail } from '../../combined/actions/copays';

export const cdpAccessToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const combinedPortalAccess = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const debtLettersShowLettersVBMS = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.debtLettersShowLettersVBMS];

export const selectLoadingFeatureFlags = state =>
  state?.featureToggles?.loading;

export const showDebtsPaymentHistory = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.CdpPaymentHistoryVba];

export const showCopayPaymentHistory = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showCopayPaymentHistory];

export const selectCopayDetail = state => 
  state.combinedPortal.mcp.currentCopay || {};

export const selectAllCopays = state => 
  state.combinedPortal.mcp.copays || [];

export const selectIsCopayDetailLoading = state =>
  state.combinedPortal.mcp.isCopayDetailLoading;

export const useCurrentCopay = () => {
  const dispatch = useDispatch();
  const { id: copayId } = useParams();
  const shouldShowCopayPaymentHistory = useSelector(showCopayPaymentHistory);
  const copayDetail = useSelector(selectCopayDetail);
  const allCopays = useSelector(selectAllCopays);
  const isLoading = useSelector(selectIsCopayDetailLoading);
  
  const shouldFetchCopay = shouldShowCopayPaymentHistory &&
      !copayDetail?.id &&
      copayDetail.id !== copayId &&
      !isLoading

  const currentCopay = shouldShowCopayPaymentHistory
    ? copayDetail
    : allCopays?.find(({ id }) => id === copayId);

  if (shouldFetchCopay) dispatch(getCopayDetail(copayId));

  return { currentCopay, isLoading };
};

// WIP: filter copays by statement_id for a given statement (e.g. invoice)
const selectStatementCopays = statementId => state =>
  (selectAllCopays(state) || []).filter(
    copay => copay.statement_id === statementId,
  );

export const useCurrentStatement = () => {
  // const _dispatch = useDispatch();
  const { id: statementId } = useParams();
  // const _shouldShowCopayPaymentHistory = useSelector(showCopayPaymentHistory);
  const statementCopays = useSelector(selectStatementCopays(statementId));
  const isLoading = useSelector(selectIsCopayDetailLoading);

  // TODO: shouldFetch for detail when needed; getCopayDetail(statementId)
  // const shouldFetch = _shouldShowCopayPaymentHistory && !copayDetail?.id && ...

  return { statementCopays, currentStatement: statementCopays?.[0], isLoading };
};
