import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchLicenseCertificationResults } from '../actions';

export const useSignalFetch = hasFetchedOnce => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!hasFetchedOnce) {
      const controller = new AbortController();

      dispatch(fetchLicenseCertificationResults(controller.signal));

      return () => {
        controller.abort();
      };
    }
    return null;
  }, []);
};
