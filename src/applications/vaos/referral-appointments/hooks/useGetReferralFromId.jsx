import { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getReferral } from '../redux/selectors';
import { fetchReferralById } from '../redux/actions';
import { FETCH_STATUS } from '../../utils/constants';

const useGetReferralFromId = id => {
  const [referralNotFound, setReferralNotFound] = useState(false);
  const [currentReferral, setCurrentReferral] = useState(null);
  const dispatch = useDispatch();
  const { referrals, referralFetchStatus } = useSelector(
    state => getReferral(state),
    shallowEqual,
  );
  useEffect(
    () => {
      if (referralFetchStatus === FETCH_STATUS.succeeded && !referrals.length) {
        setReferralNotFound(true);
      }
    },
    [referralFetchStatus, referrals],
  );
  useEffect(
    () => {
      if (referrals.length && id) {
        const referralFromParam = referrals.find(ref => ref.UUID === id);
        if (referralFromParam) {
          setCurrentReferral(referralFromParam);
        } else {
          setReferralNotFound(true);
        }
      }
    },
    [id, referrals, referralFetchStatus],
  );
  useEffect(
    () => {
      if (
        !referrals.length &&
        referralFetchStatus === FETCH_STATUS.notStarted
      ) {
        dispatch(fetchReferralById(id));
      }
    },
    [dispatch, id, referralFetchStatus, referrals],
  );
  return {
    currentReferral,
    referralFetchStatus,
    referralNotFound,
  };
};

export { useGetReferralFromId };
