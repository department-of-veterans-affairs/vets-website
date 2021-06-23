import React, { useEffect } from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { goToNextPageWithToken, getTokenFromRouter } from '../utils/navigation';

import { validateToken } from '../api';

const Landing = props => {
  const onComponentLoad = async router => {
    const token = getTokenFromRouter(router);
    if (token) {
      const json = await validateToken(token);
      if (json.appointment) {
        goToNextPageWithToken(router, 'insurance');
      } else {
        goToNextPageWithToken(router, 'failed');
      }
    }
  };

  useEffect(
    () => {
      onComponentLoad(props.router);
    },
    [props.router],
  );
  return (
    <>
      <LoadingIndicator message="Finding your appointment" />
    </>
  );
};

export default Landing;
