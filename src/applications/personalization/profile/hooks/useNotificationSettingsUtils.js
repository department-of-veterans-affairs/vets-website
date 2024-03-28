import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import {
  BLOCKED_MHV_NOTIFICATION_IDS,
  NOTIFICATION_CHANNEL_IDS,
  NOTIFICATION_GROUPS,
} from '../constants';

// helper function to get the communication preferences entities
function getEntities(prefs) {
  return {
    groups: prefs?.groups?.entities,
    items: prefs?.items?.entities,
    channels: prefs?.channels?.entities,
  };
}

/**
 * Returns an array of available notification groups based on the
 * available communication preferences and what communication channels have contact info set via the user profile
 *
 * @param {Object} communicationPreferences - The user's communication preferences.
 * @param {Array} channelsWithContactInfo - An array of channel IDs with contact info [1,2] would represent email and mobile phone
 * @returns {Array} An array of available notification groups.
 */
function getAvailableGroups(communicationPreferences, channelsWithContactInfo) {
  const { groups, items, channels } = getEntities(communicationPreferences);

  const groupIds = Object.keys(groups);

  const availableGroupIds = groupIds.filter(groupId => {
    const group = groups[groupId];
    const groupItems = group.items.map(itemId => items[itemId]);

    return groupItems.some(item =>
      item.channels.some(channelId =>
        channelsWithContactInfo.includes(channels[channelId].channelType),
      ),
    );
  });

  return availableGroupIds.map(groupId => {
    return { ...groups[groupId], id: groupId };
  });
}

export const useNotificationSettingsUtils = () => {
  const communicationPreferences = useSelector(
    state => state?.communicationPreferences,
  );

  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const loading = useToggleLoadingValue();

  const showEmailNotificationSettings = useToggleValue(
    TOGGLE_NAMES.profileShowEmailNotificationSettings,
  );

  const showMhvNotificationSettings = useToggleValue(
    TOGGLE_NAMES.profileShowMhvNotificationSettings,
  );

  const showPaymentsNotificationSetting = useToggleValue(
    TOGGLE_NAMES.profileShowPaymentsNotificationSetting,
  );

  const showQuickSubmitNotificationSetting = useToggleValue(
    TOGGLE_NAMES.profileShowQuickSubmitNotificationSetting,
  );

  const toggles = useMemo(
    () => {
      return {
        loading,
        showEmailNotificationSettings,
        showMhvNotificationSettings,
        showPaymentsNotificationSetting,
        showQuickSubmitNotificationSetting,
      };
    },
    [
      loading,
      showEmailNotificationSettings,
      showMhvNotificationSettings,
      showPaymentsNotificationSetting,
      showQuickSubmitNotificationSetting,
    ],
  );

  const channelsWithContactInfo = useSelector(state => {
    return [
      ...(selectVAPEmailAddress(state)
        ? [parseInt(NOTIFICATION_CHANNEL_IDS.EMAIL, 10)]
        : []),
      ...(selectVAPMobilePhone(state)
        ? [parseInt(NOTIFICATION_CHANNEL_IDS.TEXT, 10)]
        : []),
    ];
  });

  const missingChannels = useSelector(state => {
    return [
      ...(selectVAPEmailAddress(state)
        ? []
        : [
            { name: 'email', id: parseInt(NOTIFICATION_CHANNEL_IDS.EMAIL, 10) },
          ]),
      ...(selectVAPMobilePhone(state)
        ? []
        : [{ name: 'text', id: parseInt(NOTIFICATION_CHANNEL_IDS.TEXT, 10) }]),
    ];
  });

  const useAvailableGroups = () => {
    return getAvailableGroups(
      communicationPreferences,
      channelsWithContactInfo,
    ).filter(({ id }) => {
      // these will be removed once the feature toggles are removed
      return (
        (toggles.showQuickSubmitNotificationSetting ||
          id !== NOTIFICATION_GROUPS.QUICK_SUBMIT) &&
        (toggles.showPaymentsNotificationSetting ||
          id !== NOTIFICATION_GROUPS.PAYMENTS) &&
        (toggles.showMhvNotificationSettings ||
          id !== NOTIFICATION_GROUPS.GENERAL)
      );
    });
  };

  // creates a list of unavailable items
  // also filters out any items that are blocked by feature toggles
  // can be greatly simplified once the feature toggles are removed
  const useUnavailableItems = () => {
    const { groups, items, channels } = getEntities(communicationPreferences);

    const excludedGroupIds = [
      ...(toggles.showQuickSubmitNotificationSetting
        ? []
        : [NOTIFICATION_GROUPS.QUICK_SUBMIT]),
      ...(toggles.showPaymentsNotificationSetting
        ? []
        : [NOTIFICATION_GROUPS.PAYMENTS]),
    ];

    const excludedItemIds = [
      ...(toggles.showMhvNotificationSettings
        ? []
        : BLOCKED_MHV_NOTIFICATION_IDS),
    ];

    const itemIds = Object.keys(items);
    const excludedGroupItems = excludedGroupIds.flatMap(groupId => {
      const group = groups[groupId];
      return group ? group.items : [];
    });

    return itemIds.reduce((acc, itemId) => {
      if (
        !excludedGroupItems.includes(itemId) &&
        !excludedItemIds.includes(itemId)
      ) {
        const item = items[itemId];
        const itemChannels = item.channels.map(
          channelId => channels[channelId],
        );

        if (
          !itemChannels.some(channel =>
            channelsWithContactInfo.includes(channel.channelType),
          )
        ) {
          acc.push(item);
        }
      }

      return acc;
    }, []);
  };

  const useFilteredItemsForMHVNotifications = itemIds =>
    useMemo(
      () => {
        return toggles.showMhvNotificationSettings
          ? itemIds
          : itemIds.filter(itemId => {
              return !BLOCKED_MHV_NOTIFICATION_IDS.includes(itemId);
            });
      },
      [itemIds],
    );

  return {
    toggles,
    communicationPreferences,
    channelsWithContactInfo,
    missingChannels,
    useAvailableGroups,
    useUnavailableItems,
    useFilteredItemsForMHVNotifications,
  };
};
