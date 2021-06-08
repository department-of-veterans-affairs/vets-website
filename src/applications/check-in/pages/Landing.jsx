import React, { useEffect } from 'react';
import withFeatureFlip from '../containers/withFeatureFlip.jsx';

import { goToNextPageWithToken } from '../utils/navigation';

const Landing = props => {
  const { router } = props;
  useEffect(
    () => {
      goToNextPageWithToken(router, 'insurance');
    },
    [router],
  );
  return <></>;
};

export default withFeatureFlip(Landing);
