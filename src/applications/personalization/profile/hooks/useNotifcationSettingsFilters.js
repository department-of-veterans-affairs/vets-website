import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
// import { selectGroups } from '../ducks/communicationPreferences';
import { NOTIFICATION_CHANNEL_IDS, NOTIFICATION_GROUPS } from '../constants';

const filterChannelsByItemId = (itemId, channelEntities) => {
  return Object.values(channelEntities).filter(
    channel => channel.parentItem === itemId,
  );
};

const reduceGroupsForToggles = (groups, toggles) => {
  return Object.entries(groups.entities).reduce(
    (acc, [id, group]) => {
      if (
        (id === NOTIFICATION_GROUPS.PAYMENTS &&
          !toggles.showPaymentsNotificationSetting) ||
        (id === NOTIFICATION_GROUPS.GENERAL &&
          !toggles.showMhvNotificationSettings) ||
        (id === NOTIFICATION_GROUPS.QUICK_SUBMIT &&
          !toggles.showQuickSubmitNotificationSetting)
      ) {
        return acc;
      }

      acc.ids.push(id);
      acc.entities[id] = group;

      return acc;
    },
    { ids: [], entities: {} },
  );
};

// const useReduceGroupsForSupportedChannels = (groups, channels) => {
//   return groups.reduce((acc, group) => {});
// };

export const useNotificationSettingsUtils = () => {
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

  const useReducedGroups = groups => {
    return useMemo(() => reduceGroupsForToggles(groups, toggles), [groups]);
  };

  // const useReducedGroupsForSupportedChannels = groups => {
  //   const groupsFromToggles = useReducedGroups(groups);
  //   const channels = channelsWithContactInfo();
  // };

  // const useUnsupportedNotificationNames = () => {};

  // const notificationGroups = useSelector(state => selectGroups(state));

  // const emailAddress = useSelector(selectVAPEmailAddress);
  // const mobilePhoneNumber = useSelector(selectVAPMobilePhone);

  const useChannelsByItemId = itemId => {
    return useSelector(state =>
      filterChannelsByItemId(
        itemId,
        state?.communicationPreferences?.channels?.entities,
      ),
    );
  };

  return {
    getChannlesByItemId: useChannelsByItemId,
    getReducedGroups: useReducedGroups,
    channelsWithContactInfo,
    toggles,
  };
};
