import { useEffect } from 'react';
import { submitLaunchMessagingAal } from '../../api/SmApi';
import useFeatureToggles from '../../hooks/useFeatureToggles';

const LaunchMessagingAal = () => {
  const { isAalEnabled } = useFeatureToggles();
  useEffect(
    () => {
      const launch = async () => {
        try {
          await submitLaunchMessagingAal();
        } catch (e) {
          if (window.DD_RUM) {
            const error = new Error(
              `Error submitting AAL on Messaging launch. ${e?.errors[0] &&
                JSON.stringify(e?.errors[0])}`,
            );
            window.DD_RUM.addError(error);
          }
        }
      };
      // Only run if the AAL feature flag is enabled
      if (isAalEnabled) {
        launch();
      }
    },
    [isAalEnabled],
  );

  return null;
};

export default LaunchMessagingAal;
