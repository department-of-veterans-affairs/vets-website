import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../api';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';
import { useSessionStorage } from './useSessionStorage';
import { useTravelPayFlags } from './useTravelPayFlags';

const useSendTravelPayClaim = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [travelPayClaimData, setTravelPayClaimData] = useState({});
  const [travelPayClaimError, setTravelPayClaimError] = useState(false);

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isTravelReimbursementEnabled } = featureToggles;
  const { getShouldSendTravelPayClaim } = useSessionStorage(false);
  const {
    travelPayData,
    travelPayClaimSent,
    setTravelPayClaimSent,
    travelPayEligible,
  } = useTravelPayFlags();

  useEffect(
    () => {
      if (
        !isTravelReimbursementEnabled ||
        travelPayClaimSent ||
        !travelPayEligible ||
        !getShouldSendTravelPayClaim(window)
      ) {
        return;
      }

      setIsLoading(true);
      api.v2
        .postDayOfTravelPayClaim(travelPayData)
        .then(json => {
          setTravelPayClaimData(json.payload);
        })
        .catch(() => {
          setTravelPayClaimError(true);
        })
        .finally(() => {
          setIsLoading(false);
          setTravelPayClaimSent(true);
        });
    },
    [
      getShouldSendTravelPayClaim,
      isTravelReimbursementEnabled,
      setTravelPayClaimSent,
      travelPayData,
      travelPayEligible,
      travelPayClaimSent,
    ],
  );

  return {
    travelPayClaimError,
    travelPayEligible,
    isLoading,
    travelPayClaimData,
  };
};

export default useSendTravelPayClaim;
