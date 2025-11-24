import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

const useFeatureToggles = () => {
  const {
    featureTogglesLoading,
    isComboBoxEnabled,
    isAalEnabled,
    readReceiptsEnabled,
    customFoldersRedesignEnabled,
    largeAttachmentsEnabled,
    isDowntimeBypassEnabled,
    cernerPilotSmFeatureFlag,
    mhvSecureMessagingCuratedListFlow,
    mhvSecureMessagingRecentRecipients,
    mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag,
    mhvMockSessionFlag,
  } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        isComboBoxEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientCombobox
          ],
        isAalEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingMilestone2AAL
          ],
        readReceiptsEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingReadReceipts
          ],
        customFoldersRedesignEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingCustomFoldersRedesign
          ],
        largeAttachmentsEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingLargeAttachments
          ],
        isDowntimeBypassEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification
          ],
        cernerPilotSmFeatureFlag:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot
          ],
        mhvSecureMessagingCuratedListFlow:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow
          ],
        mhvSecureMessagingRecentRecipients:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients
          ],
        mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag:
          state.featureToggles[
            FEATURE_FLAG_NAMES
              .mhvSecureMessagingCernerPilotSystemMaintenanceBanner
          ],
        mhvMockSessionFlag: state.featureToggles['mhv-mock-session'],
      };
    },
    state => state.featureToggles,
  );

  if (featureTogglesLoading) {
    return { featureTogglesLoading };
  }
  return {
    featureTogglesLoading,
    isComboBoxEnabled,
    readReceiptsEnabled,
    isAalEnabled,
    customFoldersRedesignEnabled,
    largeAttachmentsEnabled,
    isDowntimeBypassEnabled,
    cernerPilotSmFeatureFlag,
    mhvSecureMessagingCuratedListFlow,
    mhvSecureMessagingRecentRecipients,
    mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag,
    mhvMockSessionFlag,
  };
};

export default useFeatureToggles;
