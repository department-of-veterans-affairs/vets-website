import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import PropTypes from 'prop-types';
import IntroductionDisplay from './IntroductionDisplay';

import { api } from '../../../api';

import {
  setVeteranData,
  updateFormAction,
} from '../../../actions/pre-check-in';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { URLS } from '../../../utils/navigation/pre-check-in';

import { makeSelectCurrentContext } from '../../../selectors';

const Introduction = props => {
  const { router } = props;
  const [isLoading, setIsLoading] = useState(true);

  const { goToErrorPage } = useFormRouting(router, URLS);
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
    return <va-loading-indicator message="Loading your appointment details" />;
  } else {
    return <IntroductionDisplay router={router} URLS={URLS} />;
  }
};

Introduction.propTypes = {
  router: PropTypes.object,
};

export default Introduction;
