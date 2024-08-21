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

  const getEmailAddress = useSelector(selectVAPEmailAddress);
  const getMobilePhone = useSelector(selectVAPMobilePhone);

  const channelsWithContactInfo = useSelector(() => {
    return [
      ...(getEmailAddress
        ? [parseInt(NOTIFICATION_CHANNEL_IDS.EMAIL, 10)]
        : []),
      ...(getMobilePhone ? [parseInt(NOTIFICATION_CHANNEL_IDS.TEXT, 10)] : []),
    ];
  });

  const missingChannels = useSelector(() => {
    return [
      ...(getEmailAddress
        ? []
        : [
            { name: 'email', id: parseInt(NOTIFICATION_CHANNEL_IDS.EMAIL, 10) },
          ]),
      ...(getMobilePhone
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

        if (
          !itemChannels.some(channel =>
            channelsWithContactInfo.includes(channel.channelType),
          )
        ) {
          acc.push(item);
        }

        const isItem3 = itemId === 'item3';
        const isItem4 = itemId === 'item4';
        if (isItem3) {
          const noEmail =
            profileShowMhvNotificationSettingsEmailAppointmentReminders &&
            !getEmailAddress;
          const noPhone = !getMobilePhone;

          if ((noEmail || noPhone) && !acc.some(i => i.name === item.name)) {
            acc.push(item);
          }
        } else if (isItem4) {
          const noEmail =
            profileShowMhvNotificationSettingsEmailRxShipment &&
            !getEmailAddress;
          const noPhone = !getMobilePhone;

          if ((noEmail || noPhone) && !acc.some(i => i.name === item.name)) {
            acc.push(item);
          }
        }
      }

      return acc;
    }, []);
  };

  const useFilteredItemsForMHVNotifications = itemIds =>
    useMemo(
      () => {
        return itemIds.filter(itemId => {
          // Always exclude these items: ticket# 89524
          return (
            !BLOCKED_MHV_NOTIFICATION_IDS.includes(itemId) &&
            // Exclude item9 if profileShowMhvNotificationSettingsNewSecureMessaging is turned off
            !(
              itemId === 'item9' &&
              !toggles.profileShowMhvNotificationSettingsNewSecureMessaging
            ) &&
            // Exclude item10 if profileShowMhvNotificationSettingsMedicalImages is turned off
            !(
              itemId === 'item10' &&
              !toggles.profileShowMhvNotificationSettingsMedicalImages
            )
          );
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
