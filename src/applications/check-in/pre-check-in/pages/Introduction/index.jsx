import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import IntroductionDisplay from './IntroductionDisplay';

import { api } from '../../api';

import { setVeteranData } from '../../actions';

import { useFormRouting } from '../../hooks/useFormRouting';

// @TODO Remove appointments once mock API merged in. Add cypress test for intro.
const Introduction = props => {
  const { router } = props;

  const [isLoading, setIsLoading] = useState(true);

  const { goToErrorPage } = useFormRouting(router);
  // select token from redux store
  const dispatch = useDispatch();
  const dispatchSetVeteranData = useCallback(
    payload => {
      dispatch(setVeteranData({ ...payload }));
    },
    [dispatch],
  );

  useEffect(
    () => {
      // show loading screen
      setIsLoading(true);
      //  call get data from API
      api.v2
        .getPreCheckInData()
        .then(json => {
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
    [dispatchSetVeteranData, goToErrorPage],
  );
  if (isLoading) {
    return <va-loading-indicator message="Loading your appointment details" />;
  } else {
    return <IntroductionDisplay router={router} />;
  }
};

Introduction.propTypes = {
  router: PropTypes.object,
};

export default Introduction;
