import { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getReferral } from '../redux/selectors';
import { fetchReferralById } from '../redux/actions';
import { useIsInCCPilot } from './useIsInCCPilot';

const useGetReferralById = id => {
  const dispatch = useDispatch();
  const { isInCCPilot } = useIsInCCPilot();
  const { referral, referralFetchStatus } = useSelector(
    state => getReferral(state, id),
    shallowEqual,
  );
  useEffect(
    () => {
      if (id && isInCCPilot && !referral) {
        dispatch(fetchReferralById(id));
      }
    },
    [dispatch, isInCCPilot, id, referral],
  );
  return {
    referral,
    referralFetchStatus,
  };
};

export { useGetReferralById };
