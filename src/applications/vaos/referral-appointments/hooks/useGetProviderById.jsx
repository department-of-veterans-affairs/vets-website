import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { fetchProviderDetails, setInitReferralFlow } from '../redux/actions';
import { getProviderInfo } from '../redux/selectors';
import { FETCH_STATUS } from '../../utils/constants';

function useGetProviderById(providerId) {
  const dispatch = useDispatch();
  const { provider, providerFetchStatus } = useSelector(
    state => getProviderInfo(state),
    shallowEqual,
  );
  const selectedProviderId = provider?.id;

  const loading =
    providerFetchStatus === FETCH_STATUS.loading ||
    providerFetchStatus === FETCH_STATUS.notStarted;
  const failed = providerFetchStatus === FETCH_STATUS.failed;

  useEffect(
    () => {
      const isSameProvider = providerId === selectedProviderId;
      if (!providerId || isSameProvider || failed) {
        return;
      }

      dispatch(setInitReferralFlow());
    },
    [dispatch, failed, providerId, selectedProviderId],
  );

  useEffect(
    () => {
      if (!providerId) {
        return;
      }

      if (providerFetchStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchProviderDetails(providerId));
      }
    },
    [dispatch, providerFetchStatus, providerId],
  );

  return {
    provider: providerId === provider?.id ? provider : undefined,
    loading,
    failed,
  };
}

export { useGetProviderById };
