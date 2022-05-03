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
import { preCheckinExpired } from '../../../utils/appointment';

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
          // if any appointments are tomorrow or later, the link is not expired
          if (
            payload.appointments &&
            payload.appointments.length > 0 &&
            preCheckinExpired(payload.appointments)
          ) {
            goToErrorPage('?type=expired');
          }
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
