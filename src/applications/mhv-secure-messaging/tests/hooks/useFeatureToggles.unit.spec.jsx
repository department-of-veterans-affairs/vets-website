import React from 'react';
import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import useFeatureToggles from '../../hooks/useFeatureToggles';

const mockStore = configureStore([]);

describe('useFeatureToggles', () => {
  it('returns only featureTogglesLoading when loading is true', () => {
    const initialState = {
      featureToggles: {
        loading: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientCombobox]: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingMilestone2AAL]: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingReadReceipts]: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCustomFoldersRedesign]: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingLargeAttachments]: false,
        [FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification]: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients]: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilotSystemMaintenanceBanner]: false,
        'mhv-mock-session': false,
      },
    };
    const store = mockStore(initialState);
    const { result } = renderHook(() => useFeatureToggles(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current).to.deep.equal({ featureTogglesLoading: true });
  });

  it('returns all toggles when loading is false', () => {
    const initialState = {
      featureToggles: {
        loading: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientCombobox]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingMilestone2AAL]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingReadReceipts]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCustomFoldersRedesign]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingLargeAttachments]: true,
        [FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilotSystemMaintenanceBanner]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCanReplyField]: true,
        'mhv-mock-session': true,
      },
    };
    const store = mockStore(initialState);
    const { result } = renderHook(() => useFeatureToggles(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current).to.deep.equal({
      featureTogglesLoading: false,
      isComboBoxEnabled: true,
      readReceiptsEnabled: true,
      isAalEnabled: true,
      customFoldersRedesignEnabled: true,
      largeAttachmentsEnabled: true,
      isDowntimeBypassEnabled: true,
      cernerPilotSmFeatureFlag: true,
      mhvSecureMessagingCuratedListFlow: true,
      mhvSecureMessagingRecentRecipients: true,
      mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag: true,
      mhvMockSessionFlag: true,
      useCanReplyField: true,
    });
  });
});
