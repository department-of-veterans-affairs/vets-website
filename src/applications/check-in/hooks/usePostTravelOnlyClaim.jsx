import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { api } from '../api';
import { useStorage } from './useStorage';
import { makeSelectForm, makeSelectCurrentContext } from '../selectors';
import { useFormRouting } from './useFormRouting';
import { APP_NAMES } from '../utils/appConstants';
import { URLS } from '../utils/navigation';
import { utcToFacilityTimeZone } from '../utils/appointment';

const usePostTravelOnlyClaim = props => {
  const { router } = props;
  const { jumpToPage } = useFormRouting(router);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [travelPayClaimError, setTravelPayClaimError] = useState(false);
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { appointmentToFile, startedTime } = data;
  const appointmentStartTime = utcToFacilityTimeZone(
    appointmentToFile.startTime,
    appointmentToFile.timezone,
  );
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token: uuid } = useSelector(selectCurrentContext);
  const { setTravelPaySent, getTravelPaySent } = useStorage(
    APP_NAMES.TRAVEL_CLAIM,
    true,
  );
  const { setCompleteTimestamp } = useStorage(APP_NAMES.TRAVEL_CLAIM);

  const travelPaySent = getTravelPaySent(window);
  const now = new Date().getTime();
  const timeToComplete = Math.round((now - startedTime) / 1000).toString();
  const alreadyPosted =
    differenceInCalendarDays(Date.now(), parseISO(travelPaySent)) === 0;

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
      const markTravelPayClaimSent = () => {
        setTravelPaySent(window, new Date());
      };
      if (isLoading && !isComplete) {
        return;
      }
      setIsLoading(true);
      if (alreadyPosted) {
        setIsLoading(false);
        return;
      }
      api.v2
        .postTravelOnlyClaim(appointmentStartTime, uuid, timeToComplete)
        .catch(() => {
          setTravelPayClaimError(true);
        })
        .finally(() => {
          markTravelPayClaimSent();
          setIsLoading(false);
          setIsComplete(true);
          setCompleteTimestamp(window, Date.now());
        });
    },
    [
      isLoading,
      setTravelPaySent,
      uuid,
      isComplete,
      travelPaySent,
      data,
      jumpToPage,
      timeToComplete,
      alreadyPosted,
      appointmentStartTime,
      setCompleteTimestamp,
    ],
  );

  return {
    travelPayClaimError,
    isLoading,
  };
};

export { usePostTravelOnlyClaim };
