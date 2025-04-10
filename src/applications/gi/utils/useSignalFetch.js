import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export const useSignalFetch = performFetch => {
  const dispatch = useDispatch();
  useEffect(() => {
    const controller = new AbortController();

    dispatch(performFetch(controller.signal));

    return () => {
      controller.abort();
    };
  }, []);
};
