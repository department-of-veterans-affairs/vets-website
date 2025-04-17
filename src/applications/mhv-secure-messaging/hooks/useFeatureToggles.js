import { useSelector } from 'react-redux';
// import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

const useFeatureToggles = () => {
  const { featureTogglesLoading } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
      };
    },
    state => state.featureToggles,
  );

  return { featureTogglesLoading };
};

export default useFeatureToggles;
