import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setError } from '../actions/universal';

const useUpdateError = () => {
  const dispatch = useDispatch();
  // @TODO add unit tests once this does something more
  const updateError = useCallback(
    error => {
      dispatch(setError(error));
    },
    [dispatch],
  );

  return { updateError };
};

export { useUpdateError };
