import React, { useEffect } from 'react';
import withFeatureFlip from '../containers/withFeatureFlip.jsx';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { goToNextPageWithToken } from '../utils/navigation';

const Landing = props => {
  const { router } = props;
  useEffect(
    () => {
      const timer = setTimeout(() => {
        goToNextPageWithToken(router, 'insurance');
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    },
    [router],
  );
  return (
    <>
      <LoadingIndicator message="Finding your appointment" />
    </>
  );
};

export default withFeatureFlip(Landing);
