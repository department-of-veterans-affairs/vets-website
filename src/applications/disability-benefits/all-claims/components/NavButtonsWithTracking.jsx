import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  trackBackButtonClick,
  trackContinueButtonClick,
} from '../utils/tracking/datadogRumTracking';

const NavButtonsWithTracking = ({
  DefaultNavButtons = FormNavButtons,
  goBack,
  goForward,
  submitToContinue,
  useWebComponents,
}) => {
  const handleBackClick = useCallback(
    (...args) => {
      if (!goBack) return;
      trackBackButtonClick();
      goBack(...args);
    },
    [goBack],
  );

  const handleContinueClick = useCallback(
    (...args) => {
      if (!goForward) return;
      trackContinueButtonClick();
      goForward(...args);
    },
    [goForward],
  );

  return (
    <DefaultNavButtons
      goBack={goBack ? handleBackClick : goBack}
      goForward={goForward ? handleContinueClick : goForward}
      submitToContinue={submitToContinue}
      useWebComponents={useWebComponents}
    />
  );
};

NavButtonsWithTracking.propTypes = {
  DefaultNavButtons: PropTypes.elementType,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  submitToContinue: PropTypes.bool,
  useWebComponents: PropTypes.bool,
};

export default NavButtonsWithTracking;
