import { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getReferral } from '../redux/selectors';
import { fetchReferralById } from '../redux/actions';
import { FETCH_STATUS } from '../../utils/constants';

const useGetReferralFromId = id => {
  const [currentReferral, setCurrentReferral] = useState(null);
  const dispatch = useDispatch();
  const { referrals, referralFetchStatus } = useSelector(
    state => getReferral(state),
    shallowEqual,
  );
  useEffect(
    () => {
      if (referrals && id) {
        const referralFromParam = referrals.find(ref => ref.UUID === id);
        setCurrentReferral(referralFromParam);
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
  };
};

export { useGetReferralFromId };
