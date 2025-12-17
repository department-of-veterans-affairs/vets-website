import React from 'react';
import { useSelector } from 'react-redux';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import IntroductionPage from './IntroductionPage';
import IntroductionPageUpdate from './IntroductionPageUpdate';
import IntroductionPageRedirect from './IntroductionPageRedirect';
import { isProductionOfTestProdEnv } from '../helpers';
import { selectMeb1995Reroute } from '../selectors/featureToggles';

const IntroductionRouter = props => {
  const rerouteEnabled = useSelector(selectMeb1995Reroute);
  const { useToggleLoadingValue } = useFeatureToggle();
  const isLoading = useToggleLoadingValue();

  if (isLoading || rerouteEnabled === undefined) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading feature settings..."
      />
    );
  }

  if (rerouteEnabled) {
    return <IntroductionPageRedirect {...props} />;
  }

  if (isProductionOfTestProdEnv()) {
    return <IntroductionPage {...props} />;
  }

  return <IntroductionPageUpdate {...props} />;
};

export default IntroductionRouter;
