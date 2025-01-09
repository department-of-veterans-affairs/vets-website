import { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getReferral } from '../redux/selectors';
import { fetchReferralById } from '../redux/actions';
import { FETCH_STATUS } from '../../utils/constants';
import { useIsInCCPilot } from './useIsInCCPilot';

const useGetReferralById = id => {
  const [referralNotFound, setReferralNotFound] = useState(false);
  const [currentReferral, setCurrentReferral] = useState(null);
  const dispatch = useDispatch();
  const { isInCCPilot } = useIsInCCPilot();
  const { referrals, referralFetchStatus } = useSelector(
    state => getReferral(state),
    shallowEqual,
  );
  useEffect(
    () => {
      if (isInCCPilot && (referrals.length && id)) {
        const referralFromParam = referrals.find(ref => ref.UUID === id);
        if (referralFromParam) {
          setCurrentReferral(referralFromParam);
        } else {
          setReferralNotFound(true);
        }
      }
    },
    [id, referrals, referralFetchStatus, isInCCPilot],
  );
  useEffect(
    () => {
      if (
        id &&
        isInCCPilot &&
        !referrals.length &&
        referralFetchStatus === FETCH_STATUS.notStarted
      ) {
        dispatch(fetchReferralById(id));
      }
    },
    [dispatch, isInCCPilot, id, referralFetchStatus, referrals],
  );
  return {
    currentReferral,
    referralFetchStatus,
    referralNotFound,
  };
};

export { useGetReferralById };
