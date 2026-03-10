import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getFormData } from 'platform/forms-system/src/js/state/selectors';
import IntroductionPage from '../IntroductionPage';
import IntroductionPage2 from '../IntroductionPage2';

const TOGGLE_KEY = 'view:coeFormRebuildCveteam';

export const IntroductionPageSelector = props => {
  const formData = useSelector(getFormData) || {};
  const useNewIntro = !!formData[TOGGLE_KEY];
  const IntroductionPageComponent = useNewIntro
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
