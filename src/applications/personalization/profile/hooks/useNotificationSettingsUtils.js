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
  NOTIFICATION_ITEM_IDS,
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

  const profileShowNewBenefitOverpaymentDebtNotificationSetting = useToggleValue(
    TOGGLE_NAMES.profileShowNewBenefitOverpaymentDebtNotificationSetting,
  );

  const profileShowNewHealthCareCopayBillNotificationSetting = useToggleValue(
    TOGGLE_NAMES.profileShowNewHealthCareCopayBillNotificationSetting,
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
        profileShowNewBenefitOverpaymentDebtNotificationSetting,
        profileShowNewHealthCareCopayBillNotificationSetting,
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
      profileShowNewBenefitOverpaymentDebtNotificationSetting,
      profileShowNewHealthCareCopayBillNotificationSetting,
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

  const emailAddress = useSelector(selectVAPEmailAddress);
  const mobilePhone = useSelector(selectVAPMobilePhone);

  const channelsWithContactInfo = useSelector(() => {
    return [
      ...(emailAddress ? [parseInt(NOTIFICATION_CHANNEL_IDS.EMAIL, 10)] : []),
      ...(mobilePhone ? [parseInt(NOTIFICATION_CHANNEL_IDS.TEXT, 10)] : []),
    ];
  });

  const missingChannels = useSelector(() => {
    return [
      ...(emailAddress
        ? []
        : [
            { name: 'email', id: parseInt(NOTIFICATION_CHANNEL_IDS.EMAIL, 10) },
          ]),
      ...(mobilePhone
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
        : [NOTIFICATION_ITEM_IDS.SECURE_MESSAGING]),
      ...(toggles.profileShowMhvNotificationSettingsMedicalImages
        ? []
        : [NOTIFICATION_ITEM_IDS.MEDICAL_IMAGES]),
      ...(toggles.profileShowNewBenefitOverpaymentDebtNotificationSetting
        ? []
        : [NOTIFICATION_ITEM_IDS.BENEFIT_OVERPAYMENT_DEBT]),
      ...(toggles.profileShowNewHealthCareCopayBillNotificationSetting
        ? []
        : [NOTIFICATION_ITEM_IDS.HEALTH_CARE_COPAY_BILL]),
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

        const isItem3 =
          itemId === NOTIFICATION_ITEM_IDS.HEALTH_APPOINTMENT_REMINDERS;
        const isItem4 = itemId === NOTIFICATION_ITEM_IDS.PRESCRIPTION_SHIPMENT;
        if (isItem3) {
          const noEmail =
            profileShowMhvNotificationSettingsEmailAppointmentReminders &&
            !emailAddress;
          const noPhone = !mobilePhone;

          if ((noEmail || noPhone) && !acc.some(i => i.name === item.name)) {
            acc.push(item);
          }
        } else if (isItem4) {
          const noEmail =
            profileShowMhvNotificationSettingsEmailRxShipment && !emailAddress;
          const noPhone = !mobilePhone;

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
          return (
            !BLOCKED_MHV_NOTIFICATION_IDS.includes(itemId) &&
            !(
              itemId === NOTIFICATION_ITEM_IDS.SECURE_MESSAGING &&
              !toggles.profileShowMhvNotificationSettingsNewSecureMessaging
            ) &&
            !(
              itemId === NOTIFICATION_ITEM_IDS.MEDICAL_IMAGES &&
              !toggles.profileShowMhvNotificationSettingsMedicalImages
            ) &&
            !(
              itemId === NOTIFICATION_ITEM_IDS.BENEFIT_OVERPAYMENT_DEBT &&
              !toggles.profileShowNewBenefitOverpaymentDebtNotificationSetting
            ) &&
            !(
              itemId === NOTIFICATION_ITEM_IDS.HEALTH_CARE_COPAY_BILL &&
              !toggles.profileShowNewHealthCareCopayBillNotificationSetting
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
