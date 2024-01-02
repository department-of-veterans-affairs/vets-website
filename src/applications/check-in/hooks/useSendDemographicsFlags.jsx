import { useMemo, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../api';
import { useStorage } from './useStorage';
import { useDemographicsFlags } from './useDemographicsFlags';
import { makeSelectApp, makeSelectCurrentContext } from '../selectors';

const useSendDemographicsFlags = () => {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(false);

  const {
    getShouldSendDemographicsFlags,
    setShouldSendDemographicsFlags,
  } = useStorage(app);

  const { demographicsData, demographicsFlagsEmpty } = useDemographicsFlags();

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  useLayoutEffect(
    () => {
      if (demographicsFlagsEmpty || !getShouldSendDemographicsFlags(window))
        return;

      if (token && !isComplete && !isLoading) {
        setIsLoading(true);
        api.v2
          .patchDayOfDemographicsData(demographicsData)
          .then(resp => {
            if (resp.data.error || resp.data.errors) {
              setError(true);
            } else {
              setShouldSendDemographicsFlags(window, false);
            }
          })
          .catch(() => {
            setError(true);
          })
          .finally(() => {
            setIsComplete(true);
            setIsLoading(false);
          });
      }
    },
    [
      token,
      demographicsData,
      demographicsFlagsEmpty,
      isLoading,
      setIsLoading,
      isComplete,
      setIsComplete,
      getShouldSendDemographicsFlags,
      setShouldSendDemographicsFlags,
    ],
  );
  return {
    demographicsFlagsEmpty,
    isLoading,
    isComplete,
    error,
  };
};

export { useSendDemographicsFlags };
