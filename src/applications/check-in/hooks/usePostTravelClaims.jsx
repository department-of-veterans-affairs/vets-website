import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { api } from '../api';
import { useStorage } from './useStorage';
import { makeSelectForm, makeSelectCurrentContext } from '../selectors';
import { useFormRouting } from './useFormRouting';
import { APP_NAMES } from '../utils/appConstants';
import { URLS } from '../utils/navigation';

const usePostTravelClaims = props => {
  const { router } = props;
  const { jumpToPage } = useFormRouting(router);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [travelPayClaimError, setTravelPayClaimError] = useState(false);
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { facilitiesToFile, startedTime } = data;
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token: uuid } = useSelector(selectCurrentContext);
  const { setTravelPaySent, getTravelPaySent } = useStorage(
    APP_NAMES.TRAVEL_CLAIM,
    true,
  );
  const travelPaySent = getTravelPaySent(window);
  const now = new Date().getTime();
  const timeToComplete = Math.round((now - startedTime) / 1000).toString();
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
      if (
        data['travel-vehicle'] !== 'yes' ||
        data['travel-address'] !== 'yes' ||
        data['travel-review'] !== 'yes'
      ) {
        jumpToPage(URLS.TRAVEL_INTRO);
        return;
      }
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
        .postTravelPayClaims(faciltiesToPost, uuid, timeToComplete)
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
      data,
      jumpToPage,
      timeToComplete,
    ],
  );

  return {
    travelPayClaimError,
    isLoading,
  };
};

export { usePostTravelClaims };
