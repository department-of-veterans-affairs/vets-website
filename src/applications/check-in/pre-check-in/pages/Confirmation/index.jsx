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
  const [isLoading, setIsLoading] = useState(false);
  const { goToErrorPage } = useFormRouting(router);
  const { getPreCheckinComplete, setPreCheckinComplete } = useSessionStorage();

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
      async function sendPreCheckInData() {
        // show loading screen
        setIsLoading(true);

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
            setPreCheckinComplete(window, true);
            // hide loading screen
            setIsLoading(false);
            focusElement('h1');
          }
        } catch (error) {
          goToErrorPage();
        }
      }

      if (!getPreCheckinComplete(window)?.complete) {
        sendPreCheckInData();
      }

      focusElement('h1');
    },
    [
      demographicsUpToDate,
      emergencyContactUpToDate,
      getPreCheckinComplete,
      goToErrorPage,
      nextOfKinUpToDate,
      setPreCheckinComplete,
      token,
    ],
  );
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const selectFormData = useMemo(makeSelectForm, []);
  const { data: formData } = useSelector(selectFormData);

  return (
    <PreCheckinConfirmation
      appointments={appointments}
      isLoading={isLoading}
      formData={formData}
    />
  );
};

Confirmation.propTypes = {
  router: PropTypes.object,
};

export default Confirmation;
