import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../api';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';
import { useSessionStorage } from './useSessionStorage';
import { useDemographicsFlags } from './useDemographicsFlags';

const useSendDemographicsFlags = () => {
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isDayOfDemographicsFlagsEnabled } = featureToggles;
  const { getShouldSendDemographicsFlags } = useSessionStorage(false);
  const {
    demographicsData,
    demographicsFlagsSent,
    setDemographicsFlagsSent,
    demographicsFlagsEmpty,
  } = useDemographicsFlags();

  useEffect(
    () => {
      if (
        !isDayOfDemographicsFlagsEnabled ||
        demographicsFlagsSent ||
        demographicsFlagsEmpty ||
        !getShouldSendDemographicsFlags(window)
      )
        return;
      api.v2
        .patchDayOfDemographicsData(demographicsData)
        .then(resp => {
          if (resp.data.error || resp.data.errors) {
            throw new Error();
          } else {
            setDemographicsFlagsSent(true);
          }
        })
        .catch(() => {});
    },
    [
      demographicsData,
      demographicsFlagsEmpty,
      demographicsFlagsSent,
      getShouldSendDemographicsFlags,
      isDayOfDemographicsFlagsEnabled,
      setDemographicsFlagsSent,
    ],
  );
};

export default useSendDemographicsFlags;
