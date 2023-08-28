import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../api';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';
import { useStorage } from './useStorage';
import { useTravelPayFlags } from './useTravelPayFlags';

const useSendTravelPayClaim = appointment => {
  const [isLoading, setIsLoading] = useState(false);
  const [travelPayClaimError, setTravelPayClaimError] = useState(false);
  const [travelPayClaimRequested, setTravelPayClaimRequested] = useState();

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isTravelReimbursementEnabled } = featureToggles;
  const { getShouldSendTravelPayClaim } = useStorage(false);
  const {
    travelPayData,
    travelPayClaimSent,
    setTravelPayClaimSent,
    travelPayEligible,
  } = useTravelPayFlags(appointment);

  useEffect(
    () => {
      if (travelPayData.travelQuestion) {
        setTravelPayClaimRequested(true);
      }

      if (
        isLoading ||
        !isTravelReimbursementEnabled ||
        travelPayClaimSent ||
        !travelPayEligible ||
        !travelPayData.travelQuestion ||
        !getShouldSendTravelPayClaim(window)
      ) {
        return;
      }

      setIsLoading(true);
      api.v2
        .postDayOfTravelPayClaim(travelPayData)
        .catch(() => {
          setTravelPayClaimError(true);
        })
        .finally(() => {
          setTravelPayClaimSent(true);
          setIsLoading(false);
        });
    },
    [
      getShouldSendTravelPayClaim,
      isTravelReimbursementEnabled,
      setTravelPayClaimSent,
      travelPayData,
      travelPayEligible,
      travelPayClaimSent,
      isLoading,
    ],
  );

  return {
    travelPayClaimError,
    travelPayEligible,
    isLoading,
    travelPayClaimRequested,
    travelPayClaimSent,
  };
};

export default useSendTravelPayClaim;
