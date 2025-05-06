import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

const useFeatureToggles = () => {
  const { featureTogglesLoading, isComboBoxEnabled } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        isComboBoxEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientCombobox
          ],
      };
    },
    state => state.featureToggles,
  );

  return { featureTogglesLoading, isComboBoxEnabled };
};

export default useFeatureToggles;
