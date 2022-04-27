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

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectCurrentContext } from '../../../selectors';

const Introduction = props => {
  const { router } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const { goToErrorPage } = useFormRouting(router);
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
      // show loading screen
      setIsLoading(true);
      //  call get data from API
      api.v2
        .getPreCheckInData(token)
        .then(json => {
          if (json.error) {
            goToErrorPage();
            return; // stops the rest of the code from executing and causing a state update on an unmounted component
          }
          const { payload } = json;
          if (payload.appointments && payload.appointments.length > 0) {
            const today = new Date();
            // if any appointments are tomorrow or later, the link is not expired
            let pceExpired = !Object.values(payload.appointments).some(appt => {
              const checkInExpiry = new Date(appt.checkInWindowEnd);
              if (today.getTime() < checkInExpiry.getTime()) {
                pceExpired = false;
                return true; // break the loop as soon as we have a valid appointment
              }
              return false;
            });
            if (pceExpired) {
              goToErrorPage('?expired=true');
              return;
            }
          }

          //  set data to state
          dispatchSetVeteranData(payload);
          // hide loading screen
          setIsLoading(false);
        })
        .catch(() => {
          goToErrorPage();
        });
    },
    [dispatchSetVeteranData, goToErrorPage, token],
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
