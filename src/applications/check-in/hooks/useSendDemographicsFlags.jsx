import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectApp } from '../selectors';
import { api } from '../api';
import { useStorage } from './useStorage';
import { useDemographicsFlags } from './useDemographicsFlags';

const useSendDemographicsFlags = () => {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

  const {
    getShouldSendDemographicsFlags,
    setShouldSendDemographicsFlags,
  } = useStorage(app);
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
