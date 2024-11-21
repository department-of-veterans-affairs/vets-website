import { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getReferral } from '../redux/selectors';
import { fetchReferralById } from '../redux/actions';
import { FETCH_STATUS } from '../../utils/constants';
import { selectFeatureCCDirectScheduling } from '../../redux/selectors';

const useGetReferralFromId = id => {
  const [referralNotFound, setReferralNotFound] = useState(false);
  const [currentReferral, setCurrentReferral] = useState(null);
  const dispatch = useDispatch();
  const featureCCDirectScheduling = useSelector(
    selectFeatureCCDirectScheduling,
  );
  const { referrals, referralFetchStatus } = useSelector(
    state => getReferral(state),
    shallowEqual,
  );
  useEffect(
    () => {
      if (
        featureCCDirectScheduling &&
        (referralFetchStatus === FETCH_STATUS.succeeded && !referrals.length)
      ) {
        setReferralNotFound(true);
      }
    },
    [featureCCDirectScheduling, referralFetchStatus, referrals],
  );
  useEffect(
    () => {
      if (featureCCDirectScheduling && (referrals.length && id)) {
        const referralFromParam = referrals.find(ref => ref.UUID === id);
        if (referralFromParam) {
          setCurrentReferral(referralFromParam);
        } else {
          setReferralNotFound(true);
        }
      }
    },
    [id, referrals, referralFetchStatus, featureCCDirectScheduling],
  );
  useEffect(
    () => {
      if (
        featureCCDirectScheduling &&
        !referrals.length &&
        referralFetchStatus === FETCH_STATUS.notStarted
      ) {
        dispatch(fetchReferralById(id));
      }
    },
    [dispatch, featureCCDirectScheduling, id, referralFetchStatus, referrals],
  );
  return {
    currentReferral,
    referralFetchStatus,
    referralNotFound,
  };
};

export { useGetReferralFromId };
