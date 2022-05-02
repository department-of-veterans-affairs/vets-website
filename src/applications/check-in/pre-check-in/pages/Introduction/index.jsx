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
import { preCheckinAlreadyCompleted } from '../../../utils/appointment';
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
      // show loading screen
      setIsLoading(true);
      //  call get data from API
      api.v2
        .getPreCheckInData(token)
        .then(json => {
          if (json.error) {
            goToErrorPage();
          }
          const { payload } = json;
          //  set data to state
          dispatchSetVeteranData(payload);

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
