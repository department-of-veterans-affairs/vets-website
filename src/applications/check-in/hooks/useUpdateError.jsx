import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setError } from '../actions/universal';

const useUpdateError = () => {
  const dispatch = useDispatch();
  const updateError = useCallback(
    error => {
      dispatch(setError(error));
    },
    [dispatch],
  );

  return { updateError };
};

export { useUpdateError };
