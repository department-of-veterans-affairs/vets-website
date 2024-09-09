import { useEffect } from 'react';
import { setIsDetails } from '../actions/isDetails';

export const useIsDetails = dispatch => {
  useEffect(
    () => {
      dispatch(setIsDetails(true));
      return () => {
        dispatch(setIsDetails(false));
      };
    },
    [dispatch],
  );
};
