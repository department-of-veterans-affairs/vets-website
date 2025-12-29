import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrollmentStatus } from '../utils/actions';
import { selectAuthStatus } from '../utils/selectors';

export const useLoa3UserData = () => {
  const { isUserLOA3 } = useSelector(selectAuthStatus);
  const dispatch = useDispatch();

  const getEnrollmentStatus = () => dispatch(fetchEnrollmentStatus());

  useEffect(
    () => {
      if (isUserLOA3) getEnrollmentStatus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isUserLOA3],
  );
};
