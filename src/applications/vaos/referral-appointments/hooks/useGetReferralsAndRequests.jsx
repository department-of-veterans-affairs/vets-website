import { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getReferrals } from '../redux/selectors';
import { fetchReferrals } from '../redux/actions';
import { getRequestedAppointmentListInfo } from '../../redux/selectors';
import { fetchPendingAppointments } from '../../redux/actions';
import { FETCH_STATUS } from '../../utils/constants';

const useGetReferralsAndRequests = () => {
  const [loading, setLoading] = useState(true);
  const [referralsError, setReferralsError] = useState(false);
  const [requestsError, setRequestsError] = useState(false);
  const dispatch = useDispatch();

  const { referrals, referralsFetchStatus } = useSelector(
    state => getReferrals(state),
    shallowEqual,
  );

  const {
    pendingAppointments,
    pendingStatus,
    showScheduleButton,
  } = useSelector(
    state => getRequestedAppointmentListInfo(state),
    shallowEqual,
  );
  useEffect(() => {
    if (referralsFetchStatus === FETCH_STATUS.notStarted) {
      dispatch(fetchReferrals());
    }
    if (pendingStatus === FETCH_STATUS.notStarted) {
      dispatch(fetchPendingAppointments());
    }
    if (
      (pendingStatus === FETCH_STATUS.succeeded ||
        pendingStatus === FETCH_STATUS.failed) &&
      (referralsFetchStatus === FETCH_STATUS.succeeded ||
        referralsFetchStatus === FETCH_STATUS.failed)
    ) {
      setLoading(false);
    }
    if (pendingStatus === FETCH_STATUS.failed) {
      setRequestsError(true);
    }
    if (referralsFetchStatus === FETCH_STATUS.failed) {
      setReferralsError(true);
    }
  }, [pendingStatus, referralsFetchStatus, dispatch]);

  return {
    loading,
    referrals,
    pendingAppointments,
    showScheduleButton,
    referralsError,
    requestsError,
  };
};

export { useGetReferralsAndRequests };
