import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { NOTIFICATION_CHANNEL_IDS, NOTIFICATION_GROUPS } from '../constants';

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
        profileShowMhvNotificationSettingsNewSecureMessaging,
        profileShowMhvNotificationSettingsEmailRxShipment,
        profileShowMhvNotificationSettingsMedicalImages,
      };
    },
    [
      loading,
      showPaymentsNotificationSetting,
      showQuickSubmitNotificationSetting,
      profileShowMhvNotificationSettingsEmailAppointmentReminders,
      profileShowMhvNotificationSettingsNewSecureMessaging,
      profileShowMhvNotificationSettingsEmailRxShipment,
      profileShowMhvNotificationSettingsMedicalImages,
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
        id !== NOTIFICATION_GROUPS.QUICK_SUBMIT &&
        (toggles.showPaymentsNotificationSetting ||
          id !== NOTIFICATION_GROUPS.PAYMENTS) &&
        id !== NOTIFICATION_GROUPS.GENERAL
      );
    });
  };

  const activeHealthcareItems = useMemo(
    () => {
      const emailIds = [];
      if (profileShowMhvNotificationSettingsNewSecureMessaging) {
        emailIds.push('item9');
      }
      if (profileShowMhvNotificationSettingsMedicalImages) {
        emailIds.push('item10');
      }
      return emailIds;
    },
    [
      profileShowMhvNotificationSettingsEmailRxShipment,
      profileShowMhvNotificationSettingsMedicalImages,
      profileShowMhvNotificationSettingsNewSecureMessaging,
    ],
  );

  const getEmailAddress = useSelector(state => selectVAPEmailAddress(state));
  const getMobilePhone = useSelector(state => selectVAPMobilePhone(state));

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

    const itemIds = Object.keys(items);
    const excludedGroupItems = excludedGroupIds.flatMap(groupId => {
      const group = groups[groupId];
      return group ? group.items : [];
    });
    return itemIds.reduce((acc, itemId) => {
      // Rx refill shipment = item7, va appointment reminders = item8
      // Biweekly MHV newsletter = item11, Quick Submit = item12
      const excludedItems = ['item7', 'item8', 'item11', 'item12'];
      if (excludedItems.includes(itemId)) {
        return acc;
      }
      if (
        !activeHealthcareItems.includes(itemId) &&
        channelsWithContactInfo.includes(NOTIFICATION_CHANNEL_IDS.TEXT)
      ) {
        return acc;
      }

      if (!excludedGroupItems.includes(itemId)) {
        const item = items[itemId];
        const itemChannels = item.channels.map(
          channelId => channels[channelId],
        );

        const noContactInfo = !itemChannels.some(channel =>
          channelsWithContactInfo.includes(channel.channelType),
        );
        if (noContactInfo) acc.push(item);

        const isItem3 = itemId === 'item3';
        if (
          isItem3 &&
          profileShowMhvNotificationSettingsEmailAppointmentReminders &&
          !getEmailAddress
        ) {
          acc.push(item);
        }
        if (isItem3 && !getMobilePhone) acc.push(item);
      }

      return acc;
    }, []);
  };

  /*
    These notification item IDs are not currently supported by the VA Profile'

    items                                       - itemId
    Prescription shipment and tracking updates    - 4 
    Rx refill shipment notification               - 7 (needs to be removed)
    VA Appointment reminders                      - 8 (needs to be removed)
    Securing messaging alert                      - 9
    Medical images and reports available          - 10
  */

  const useFilteredItemsForMHVNotifications = itemIds =>
    useMemo(
      () => {
        const settingsMap = {
          item4: profileShowMhvNotificationSettingsEmailRxShipment,
          item9: profileShowMhvNotificationSettingsNewSecureMessaging,
          item10: profileShowMhvNotificationSettingsMedicalImages,
        };

        const filteredIds = itemIds.filter(
          itemId => !['item7', 'item8', 'item11'].includes(itemId),
        );
        return filteredIds.filter(itemId => settingsMap[itemId] !== false);
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
    profileShowMhvNotificationSettingsEmailAppointmentReminders,
  };
};
