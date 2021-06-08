import React, { useEffect } from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { goToNextPageWithToken } from '../utils/navigation';

const Landing = props => {
  const { router } = props;
  useEffect(
    () => {
      goToNextPageWithToken(router, 'insurance');
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
