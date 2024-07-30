import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import { api } from '../api';
import { isUUID } from '../utils/token-format-validator';

import { useStorage } from './useStorage';
import { useUpdateError } from './useUpdateError';
import { APP_NAMES } from '../utils/appConstants';

import { makeSelectCurrentContext, makeSelectForm } from '../selectors';

const useSendPreCheckInData = () => {
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const [isLoading, setIsLoading] = useState(true);
  const { getPreCheckinComplete, setPreCheckinComplete } = useStorage(
    APP_NAMES.PRE_CHECK_IN,
  );

  const { updateError } = useUpdateError();

  const {
    demographicsUpToDate = null,
    emergencyContactUpToDate = null,
    nextOfKinUpToDate = null,
  } = data;

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  useEffect(
    () => {
      async function sendPreCheckInData() {
        // Set pre-checkin complete and send demographics flags.
        const preCheckInData = { uuid: token };

        if (demographicsUpToDate) {
          preCheckInData.demographicsUpToDate = demographicsUpToDate === 'yes';
        }
        if (nextOfKinUpToDate) {
          preCheckInData.nextOfKinUpToDate = nextOfKinUpToDate === 'yes';
        }
        if (emergencyContactUpToDate) {
          preCheckInData.emergencyContactUpToDate =
            emergencyContactUpToDate === 'yes';
        }
        try {
          const resp = await api.v2.postPreCheckInData({ ...preCheckInData });
          if (resp.data.error || resp.data.errors) {
            updateError('pre-check-in-post-error');
          } else {
            setPreCheckinComplete(window, true);
            // hide loading screen
            setIsLoading(false);
            focusElement('h1');
          }
        } catch (error) {
          updateError('error-completing-pre-check-in');
        }
      }
      if (!getPreCheckinComplete(window)?.complete && isUUID(token)) {
        sendPreCheckInData();
      } else {
        // hide loading screen
        setIsLoading(false);
      }

      focusElement('h1');
    },
    [
      demographicsUpToDate,
      emergencyContactUpToDate,
      getPreCheckinComplete,
      updateError,
      nextOfKinUpToDate,
      setPreCheckinComplete,
      token,
    ],
  );

  return { isLoading };
};

export { useSendPreCheckInData };
