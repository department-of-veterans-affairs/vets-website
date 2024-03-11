import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../api';
import { useStorage } from './useStorage';
import { makeSelectForm, makeSelectCurrentContext } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';

const usePostTravelClaims = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsCopmlete] = useState(false);
  const [travelPayClaimError, setTravelPayClaimError] = useState(false);
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { facilitiesToFile } = data;
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token: uuid } = useSelector(selectCurrentContext);
  const { setTravelPaySent, getTravelPaySent } = useStorage(
    APP_NAMES.TRAVEL_CLAIM,
    true,
  );
  const sentTravelClaims = getTravelPaySent(window);

  const faciltiesToPost = facilitiesToFile.filter(
    facility => !(facility.stationNo in sentTravelClaims),
  );
  useEffect(
    () => {
      const markTravelPayClaimSent = facilities => {
        facilities.forEach(facility => {
          sentTravelClaims[facility.stationNo] = new Date();
          setTravelPaySent(window, sentTravelClaims);
        });
      };
      if (isLoading && !isComplete) {
        return;
      }
      setIsLoading(true);
      if (!faciltiesToPost.length) {
        setIsLoading(false);
        return;
      }
      api.v2
        .postTravelPayClaims(faciltiesToPost, uuid)
        .catch(() => {
          setTravelPayClaimError(true);
        })
        .finally(() => {
          markTravelPayClaimSent(faciltiesToPost);
          setIsLoading(false);
          setIsCopmlete(true);
        });
    },
    [
      isLoading,
      sentTravelClaims,
      setTravelPaySent,
      uuid,
      isComplete,
      faciltiesToPost,
    ],
  );

  return {
    travelPayClaimError,
    isLoading,
  };
};

export { usePostTravelClaims };
