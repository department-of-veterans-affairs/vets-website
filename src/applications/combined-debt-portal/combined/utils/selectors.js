import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { useParams } from 'react-router-dom';
import { getAllCopays, getAllLighthouseCopays, getCopayDetail } from '../../combined/actions/copays';

export const selectUserFullName = state =>
  state?.user?.profile?.userFullName;

export const cdpAccessToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const combinedPortalAccess = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const debtLettersShowLettersVBMS = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.debtLettersShowLettersVBMS];

export const selectLoadingFeatureFlags = state =>
  state?.featureToggles?.loading;

export const useLighthouseDebts = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.CdpPaymentHistoryVba];

export const useLighthouseCopays = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showVHAPaymentHistory];

export const selectCopayDetail = state => 
  state.combinedPortal.mcp.currentCopay || {};

export const selectAllCopays = state => 
  state.combinedPortal.mcp.copays;

export const selectIsCopayDetailLoading = state =>
  state.combinedPortal.mcp.isCopayDetailLoading;

export const selectIsCopaysLoading = state =>
  state.combinedPortal.mcp.isCopaysLoading;

export const useCurrentCopay = () => {
  const dispatch = useDispatch();
  const { id: copayId } = useParams();
  const shouldUseLighthouseCopays = useSelector(useLighthouseCopays);
  const copayDetail = useSelector(selectCopayDetail);
  const allCopays = useSelector(selectAllCopays);
  const isLoading = useSelector(selectIsCopayDetailLoading);
  
  const shouldFetchCopay = shouldUseLighthouseCopays &&
      !copayDetail?.id &&
      copayDetail.id !== copayId &&
      !isLoading

  const currentCopay = shouldUseLighthouseCopays
    ? copayDetail
    : allCopays?.find(({ id }) => id === copayId);

  if (shouldFetchCopay) dispatch(getCopayDetail(copayId));

  return { currentCopay, isLoading };
};

const selectStatementCopays = (copays, statementId) => state =>
  copays?.filter(
    copay => copay.statement_id === statementId,
  );

export const useCurrentStatement = () => {
  const { id: statementId } = useParams();
  
  const allCopays = useSelector(selectAllCopays);
  const statementCopays = useSelector(selectStatementCopays(allCopays, statementId));
  const isLoading = useSelector(selectIsCopaysLoading);
  
  const hasCurrentStatement = allCopays[0]?.statement_id !== statementId;
  const shouldFetchCopays = !allCopays && !isLoading && !hasCurrentStatement
  if (shouldFetchCopays) {
    const dispatch = useDispatch();
    const shouldUseLighthouseCopays = useSelector(useLighthouseCopays);
    shouldUseLighthouseCopays ? dispatch(getAllLighthouseCopays) : dispatch(getAllCopays)
  }

  return { statementCopays, isLoading };
};
