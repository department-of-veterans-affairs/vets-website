import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchOHSyncStatus } from '../actions/ohSyncStatus';

const FetchOHSyncStatus = () => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(fetchOHSyncStatus());
    },
    [dispatch],
  );

  return null;
};

export default FetchOHSyncStatus;
