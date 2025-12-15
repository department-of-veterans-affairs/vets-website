import { useEffect } from 'react';
import { submitLaunchMessagingAal } from '../../api/SmApi';
import useFeatureToggles from '../../hooks/useFeatureToggles';
import { getFirstError } from '../../util/serverErrors';

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
              `Error submitting AAL on Messaging launch. ${getFirstError(e) &&
                JSON.stringify(getFirstError(e))}`,
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
