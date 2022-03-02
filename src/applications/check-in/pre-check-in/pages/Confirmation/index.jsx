import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';

import { api } from '../../../api';
import PreCheckinConfirmation from '../../../components/PreCheckinConfirmation';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useSessionStorage } from '../../../hooks/useSessionStorage';

import {
  makeSelectCurrentContext,
  makeSelectForm,
  makeSelectVeteranData,
} from '../../../selectors';

const Confirmation = props => {
  const { router } = props;
  const [isLoading, setIsLoading] = useState(true);
  const { goToErrorPage } = useFormRouting(router);
  const { getComplete, setComplete } = useSessionStorage();

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const {
    demographicsUpToDate = null,
    emergencyContactUpToDate = null,
    nextOfKinUpToDate = null,
  } = data;

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  useEffect(
    () => {
      // show loading screen
      setIsLoading(true);

      focusElement('h1');

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
            goToErrorPage();
          } else {
            setComplete(window, true);
            // hide loading screen
            setIsLoading(false);
          }
        } catch (error) {
          goToErrorPage();
        }
      }

      if (!getComplete(window)?.complete) {
        sendPreCheckInData();
      }
    },
    [
      demographicsUpToDate,
      emergencyContactUpToDate,
      getComplete,
      goToErrorPage,
      nextOfKinUpToDate,
      setComplete,
      token,
    ],
  );
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const selectFormData = useMemo(makeSelectForm, []);
  const { data: formData } = useSelector(selectFormData);
  const hasUpdates = Object.values(formData).includes('no');

  return (
    <PreCheckinConfirmation
      appointments={appointments}
      hasUpdates={hasUpdates}
      isLoading={isLoading}
    />
  );
};

Confirmation.propTypes = {
  router: PropTypes.object,
};

export default Confirmation;
