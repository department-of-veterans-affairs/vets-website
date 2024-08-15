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

  const profileShowMhvNotificationSettingsEmailAppointmentReminders = useToggleValue(
    TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailAppointmentReminders,
  );

  const profileShowMhvNotificationSettingsNewSecureMessaging = useToggleValue(
    TOGGLE_NAMES.profileShowMhvNotificationSettingsNewSecureMessaging,
  );

  const profileShowMhvNotificationSettingsEmailRxShipment = useToggleValue(
    TOGGLE_NAMES.profileShowMhvNotificationSettingsEmailRxShipment,
  );

  const profileShowMhvNotificationSettingsMedicalImages = useToggleValue(
    TOGGLE_NAMES.profileShowMhvNotificationSettingsMedicalImages,
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
        showPaymentsNotificationSetting,
        showQuickSubmitNotificationSetting,
        profileShowMhvNotificationSettingsEmailAppointmentReminders,
        profileShowMhvNotificationSettingsEmailRxShipment,
        profileShowMhvNotificationSettingsNewSecureMessaging,
        profileShowMhvNotificationSettingsMedicalImages,
      };
    },
    [
      loading,
      showPaymentsNotificationSetting,
      showQuickSubmitNotificationSetting,
      profileShowMhvNotificationSettingsEmailAppointmentReminders,
      profileShowMhvNotificationSettingsEmailRxShipment,
      profileShowMhvNotificationSettingsNewSecureMessaging,
      profileShowMhvNotificationSettingsMedicalImages,
    ],
  );

  const showEmail = useMemo(
    () => {
      return (
        toggles.profileShowMhvNotificationSettingsEmailAppointmentReminders ||
        toggles.profileShowMhvNotificationSettingsEmailRxShipment ||
        toggles.profileShowMhvNotificationSettingsMedicalImages ||
        toggles.profileShowMhvNotificationSettingsNewSecureMessaging
      );
    },
    [toggles],
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
      // will always hide general and quick submit
      return (
        id !== NOTIFICATION_GROUPS.QUICK_SUBMIT &&
        id !== NOTIFICATION_GROUPS.GENERAL &&
        (toggles.showPaymentsNotificationSetting ||
          id !== NOTIFICATION_GROUPS.PAYMENTS)
      );
    });
  };

  const getEmailAddress = useSelector(state => selectVAPEmailAddress(state));
  const getMobilePhone = useSelector(state => selectVAPMobilePhone(state));

  // creates a list of unavailable items
  // also filters out any items that are blocked by feature toggles
  // can be greatly simplified once the feature toggles are removed
  const useUnavailableItems = () => {
    const { groups, items, channels } = getEntities(communicationPreferences);

    const excludedGroupIds = [
      // Always exclude QUICK_SUBMIT and GENERAL
      NOTIFICATION_GROUPS.QUICK_SUBMIT,
      NOTIFICATION_GROUPS.GENERAL,
      ...(toggles.showPaymentsNotificationSetting
        ? []
        : [NOTIFICATION_GROUPS.PAYMENTS]),
    ];

    const excludedItemIds = [
      ...BLOCKED_MHV_NOTIFICATION_IDS,
      ...(toggles.profileShowMhvNotificationSettingsNewSecureMessaging
        ? []
        : ['item9']),
      ...(toggles.profileShowMhvNotificationSettingsMedicalImages
        ? []
        : ['item10']),
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

        const isItem3 = itemId === 'item3';
        const isItem4 = itemId === 'item4';
        if (
          isItem3 &&
          profileShowMhvNotificationSettingsEmailAppointmentReminders &&
          !getEmailAddress
        ) {
          acc.push(item);
        }
        if (isItem3 && !getMobilePhone) acc.push(item);

        if (
          isItem4 &&
          profileShowMhvNotificationSettingsEmailRxShipment &&
          !getEmailAddress
        ) {
          acc.push(item);
        }
        if (isItem4 && !getMobilePhone) acc.push(item);

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
        // Always exclude these items: ticket# 89524
        const alwaysExcludedItems = ['item7', 'item8', 'item11', 'item12'];

        return itemIds.filter(itemId => {
          // always exclude items in alwaysExcludedItems
          if (alwaysExcludedItems.includes(itemId)) {
            return false;
          }
          // exclude item9 if profileShowMhvNotificationSettingsNewSecureMessaging is turned off
          if (
            itemId === 'item9' &&
            !toggles.profileShowMhvNotificationSettingsNewSecureMessaging
          ) {
            return false;
          }
          // exclude item10 if profileShowMhvNotificationSettingsMedicalImages is turned off
          if (
            itemId === 'item10' &&
            !toggles.profileShowMhvNotificationSettingsMedicalImages
          ) {
            return false;
          }
          // include all other items
          return true;
        });
      },
      [itemIds],
    );

  return {
    toggles,
    showEmail,
    communicationPreferences,
    channelsWithContactInfo,
    missingChannels,
    useAvailableGroups,
    useUnavailableItems,
    useFilteredItemsForMHVNotifications,
  };
};
