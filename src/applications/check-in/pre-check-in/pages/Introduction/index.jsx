import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import IntroductionDisplay from './IntroductionDisplay';

import { api } from '../../api';

// @TODO Remove appointments once mock API merged in. Add cypress test for intro.
const Introduction = props => {
  const { router } = props;
  const [isLoading, setIsLoading] = useState(false);
  // select token from redux store

  useEffect(() => {
    // show loading screen
    setIsLoading(true);
    //  call get data from API
    api.v2.getPreCheckInData().then(() => {
      //  set data to state
      // hide loading screen
      setIsLoading(false);
    });
  }, []);
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
