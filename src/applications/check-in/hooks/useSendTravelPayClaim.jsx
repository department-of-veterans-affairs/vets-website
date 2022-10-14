import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../api';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';
import { useSessionStorage } from './useSessionStorage';
import { useTravelPayFlags } from './useTravelPayFlags';

const useSendTravelPayClaim = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [travelPayClaimData, setTravelPayClaimData] = useState(null);
  const [travelPayClaimError, setTravelPayClaimError] = useState(false);
  const [travelPayClaimRequested, setTravelPayClaimRequested] = useState(false);

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
        .then(json => {
          setTravelPayClaimData(json.data);
        })
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
    travelPayClaimData,
    travelPayClaimRequested,
  };
};

export default useSendTravelPayClaim;
