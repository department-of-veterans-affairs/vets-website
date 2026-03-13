import { useDispatch, useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { useParams } from 'react-router-dom';
import {
  getAllCopays,
  getAllLighthouseCopays,
  getCopayDetail,
} from '../actions/copays';
import { lighthouseData } from './mocks/mockCopayForLocal';

export const selectUserFullName = state => state?.user?.profile?.userFullName;

export const cdpAccessToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const combinedPortalAccess = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const debtLettersShowLettersVBMS = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.debtLettersShowLettersVBMS];

export const selectLoadingFeatureFlags = state =>
  state?.featureToggles?.loading;

export const showPaymentHistory = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.CdpPaymentHistoryVba];

export const useLighthouseCopays = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showVHAPaymentHistory];

export const selectCopayDetail = state =>
  state.combinedPortal.mcp.currentCopay || {};

export const selectAllCopays = state => state.combinedPortal.mcp.copays;

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

  const shouldFetchCopay =
    shouldUseLighthouseCopays &&
    !copayDetail?.id &&
    copayDetail.id !== copayId &&
    !isLoading;

  const currentCopay = shouldUseLighthouseCopays
    ? copayDetail
    : allCopays?.find(({ id }) => id === copayId);

  if (shouldFetchCopay) dispatch(getCopayDetail(copayId));

  return { currentCopay, isLoading };
};

const selectLighthouseCopays = () => {
  // TODO: this is where new BE integration will go
  return lighthouseData;
};

const selectStatementCopays = statementId => _state => {
  const list = selectLighthouseCopays();
  return list?.filter(copay => copay.statement_id === statementId) ?? [];
};

export const useCurrentStatement = () => {
  const dispatch = useDispatch();
  const { id: statementId } = useParams();
  const shouldUseLighthouseCopays = useSelector(useLighthouseCopays);

  const allCopays = useSelector(selectAllCopays);
  const copaysList = useSelector(selectLighthouseCopays);
  const statementCopays = useSelector(selectStatementCopays(statementId));
  const isLoading = useSelector(selectIsCopaysLoading);

  const hasCurrentStatement = copaysList[0]?.statement_id !== statementId;
  const shouldFetchCopays = !allCopays && !isLoading && !hasCurrentStatement;
  if (shouldFetchCopays) {
    if (shouldUseLighthouseCopays) {
      getAllLighthouseCopays(dispatch);
    } else {
      getAllCopays(dispatch);
    }
  }

  return { statementCopays, isLoading };
};
