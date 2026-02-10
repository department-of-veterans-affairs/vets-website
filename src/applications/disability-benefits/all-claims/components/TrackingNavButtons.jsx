import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  trackBackButtonClick,
  trackContinueButtonClick,
} from '../utils/tracking/datadogRumTracking';

const safelyTrack = (trackFn, context) => {
  if (!trackFn) return;

  try {
    trackFn(context);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Tracking Error]', error);
  }
};

export const createTrackingNavButtons = getTrackingContext => {
  const TrackingNavButtons = ({
    DefaultNavButtons = FormNavButtons,
    goBack,
    goForward,
    submitToContinue,
    useWebComponents,
  }) => {
    const handleBackClick = useCallback(
      (...args) => {
        if (!goBack) return;
        const { featureToggles, pathname } = getTrackingContext() || {};
        safelyTrack(trackBackButtonClick, { featureToggles, pathname });
        goBack(...args);
      },
      [getTrackingContext, goBack],
    );

    const handleContinueClick = useCallback(
      (...args) => {
        if (!goForward) return;
        const { featureToggles, pathname } = getTrackingContext() || {};
        safelyTrack(trackContinueButtonClick, { featureToggles, pathname });
        goForward(...args);
      },
      [getTrackingContext, goForward],
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

  TrackingNavButtons.propTypes = {
    DefaultNavButtons: PropTypes.elementType,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    submitToContinue: PropTypes.bool,
    useWebComponents: PropTypes.bool,
  };

  return TrackingNavButtons;
};
