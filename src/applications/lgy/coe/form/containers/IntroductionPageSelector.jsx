import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import IntroductionPage from './IntroductionPage';
import IntroductionPage2 from './IntroductionPage2';

export const IntroductionPageSelector = props => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const enableCveIntro = useToggleValue(TOGGLE_NAMES.coeEnableCveIntro);
  const IntroductionPageComponent = enableCveIntro
    ? IntroductionPage2
    : IntroductionPage;

  return <IntroductionPageComponent {...props} />;
};

IntroductionPageSelector.propTypes = {
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  route: PropTypes.object,
};
