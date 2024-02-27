import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { api } from '../api';
import { makeSelectCurrentContext } from '../selectors';

import { receivedTravelData } from '../actions/travel-claim';

import { useFormRouting } from './useFormRouting';

import { useUpdateError } from './useUpdateError';

const useGetTravelClaimData = ({ refreshNeeded, router }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(refreshNeeded);
  const [isComplete, setIsComplete] = useState(false);
  const [travelClaimDataError, setTravelClaimDataError] = useState(false);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const { jumpToPage } = useFormRouting(router);

  const dispatch = useDispatch();

  const { updateError } = useUpdateError();

  const refreshTravelClaimData = () => {
    setIsStale(true);
  };

  const setTravelData = useCallback(
    payload => {
      batch(() => {
        dispatch(receivedTravelData(payload));
      });
    },
    [dispatch],
  );

  useLayoutEffect(
    () => {
      if (isStale && token && !isLoading) {
        setIsLoading(true);
        api.v2
          .getCheckInData(token, 'oh')
          .then(json => {
            setTravelData(json.payload);
          })
          .catch(e => {
            if (e.errors && e.errors[0]?.status === '404') {
              updateError('uuid-not-found');
            } else {
              setTravelClaimDataError(true);
            }
          })
          .finally(() => {
            setIsStale(false);
            setIsComplete(true);
            setIsLoading(false);
          });
      }
    },
    [isStale, setTravelData, token, isLoading, updateError, jumpToPage],
  );

  return {
    travelClaimDataError,
    isLoading,
    refreshTravelClaimData,
    isComplete,
  };
};

export { useGetTravelClaimData };
