import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import IntroductionDisplay from './IntroductionDisplay';

import { api } from '../../../api';

import {
  setVeteranData,
  updateFormAction,
} from '../../../actions/pre-check-in';

import { makeSelectCurrentContext } from '../../../selectors';
import {
  appointmentWasCanceled,
  preCheckinAlreadyCompleted,
  preCheckinExpired,
} from '../../../utils/appointment';
import { URLS } from '../../../utils/navigation';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useSessionStorage } from '../../../hooks/useSessionStorage';

const Introduction = props => {
  const { router } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { goToErrorPage, jumpToPage } = useFormRouting(router);
  const { setPreCheckinComplete } = useSessionStorage();

  // select token from redux store
  const dispatch = useDispatch();
  const dispatchSetVeteranData = useCallback(
    payload => {
      batch(() => {
        dispatch(setVeteranData({ ...payload }));
        dispatch(updateFormAction({ ...payload }));
      });
    },
    [dispatch],
  );

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  useEffect(
    () => {
      const setDataToState = async data => {
        await dispatchSetVeteranData(data);
      };
      // show loading screen
      setIsLoading(true);
      //  call get data from API
      api.v2
        .getPreCheckInData(token)
        .then(json => {
          if (json.error) {
            goToErrorPage();
            return; // prevent a react no-op on an unmounted component
          }
          const { payload } = json;
          //  set data to state
          setDataToState(payload);

          // We do this check before pre-checkin already completed so we don't
          // show a success message on the day of the appointment that could lead
          // the Veteran to believe they completed day-of check-in.
          //
          // If any appointments are tomorrow or later, the link is not expired.
          if (
            payload.appointments &&
            payload.appointments.length > 0 &&
            preCheckinExpired(payload.appointments)
          ) {
            goToErrorPage();
          }

          if (appointmentWasCanceled(payload.appointments)) {
            goToErrorPage();
          }

          if (preCheckinAlreadyCompleted(payload.appointments)) {
            setPreCheckinComplete(window, true);
            jumpToPage(URLS.COMPLETE);
          }

          // hide loading screen
          setIsLoading(false);
        })
        .catch(() => {
          goToErrorPage();
        });
    },
    [
      dispatchSetVeteranData,
      goToErrorPage,
      jumpToPage,
      setPreCheckinComplete,
      token,
    ],
  );
  if (isLoading) {
    return (
      <va-loading-indicator message={t('loading-your-appointment-details')} />
    );
  }
  return <IntroductionDisplay router={router} />;
};

Introduction.propTypes = {
  router: PropTypes.object,
};

export default Introduction;
