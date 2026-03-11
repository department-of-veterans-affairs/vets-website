import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import ConfirmationPage from '../ConfirmationPage';
import ConfirmationPage2 from '../ConfirmationPage2';

// Changed this from Intro version for testing purposes including using Boolean instead of !!
export const shouldUseNewConfirmation = enabled => Boolean(enabled);

export const ConfirmationPageSelector = props => {
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();
  const enableNewConfirmation = useToggleValue(
    TOGGLE_NAMES.coeFormRebuildCveteam,
  );
  const isLoading = useToggleLoadingValue(TOGGLE_NAMES.coeFormRebuildCveteam);
  const ConfirmationPageComponent = shouldUseNewConfirmation(
    enableNewConfirmation,
  )
    ? ConfirmationPage2
    : ConfirmationPage;

  if (isLoading) {
    return <va-loading-indicator message="Loading your application..." />;
  }

  return <ConfirmationPageComponent {...props} />;
};

ConfirmationPageSelector.propTypes = {
  route: PropTypes.object,
};

export default ConfirmationPageSelector;
