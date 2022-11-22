import { useEffect } from 'react';
import { api } from '../api';
import { useSessionStorage } from './useSessionStorage';
import { useDemographicsFlags } from './useDemographicsFlags';

const useSendDemographicsFlags = () => {
  const {
    getShouldSendDemographicsFlags,
    setShouldSendDemographicsFlags,
  } = useSessionStorage(false);
  const {
    demographicsData,
    demographicsFlagsSent,
    setDemographicsFlagsSent,
    demographicsFlagsEmpty,
  } = useDemographicsFlags();

  useEffect(
    () => {
      if (
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
            setShouldSendDemographicsFlags(window, false);
          }
        })
        .catch(() => {});
    },
    [
      demographicsData,
      demographicsFlagsEmpty,
      demographicsFlagsSent,
      getShouldSendDemographicsFlags,
      setDemographicsFlagsSent,
      setShouldSendDemographicsFlags,
    ],
  );
};

export default useSendDemographicsFlags;
