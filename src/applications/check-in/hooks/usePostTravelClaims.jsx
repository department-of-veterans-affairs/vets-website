import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { api } from '../api';
import { useStorage } from './useStorage';
import { makeSelectForm, makeSelectCurrentContext } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';

const usePostTravelClaims = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
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
  const travelPaySent = getTravelPaySent(window);

  const faciltiesToPost = facilitiesToFile.filter(
    facility =>
      !(facility.stationNo in travelPaySent) ||
      differenceInCalendarDays(
        Date.now(),
        parseISO(travelPaySent[facility.stationNo]),
      ),
  );
  useEffect(
    () => {
      const markTravelPayClaimSent = facilities => {
        facilities.forEach(facility => {
          travelPaySent[facility.stationNo] = new Date();
          setTravelPaySent(window, travelPaySent);
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
          setIsComplete(true);
        });
    },
    [
      isLoading,
      setTravelPaySent,
      uuid,
      isComplete,
      faciltiesToPost,
      travelPaySent,
    ],
  );

  return {
    travelPayClaimError,
    isLoading,
  };
};

export { usePostTravelClaims };
