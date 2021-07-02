import React, { useEffect } from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { goToNextPageWithToken, getTokenFromRouter } from '../utils/navigation';

import { validateToken } from '../api';

const Landing = props => {
  const { router } = props;

  useEffect(
    () => {
      const token = getTokenFromRouter(router);
      if (token) {
        validateToken(token).then(json => {
          const { data } = json;
          if (data.isValid) {
            // dispatch data into redux

            goToNextPageWithToken(router, 'insurance');
          } else {
            goToNextPageWithToken(router, 'failed');
          }
        });
      }
    },
    [router],
  );
  return (
    <>
      <LoadingIndicator message="Finding your appointment" />
    </>
  );
};

export default Landing;
