import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { selectItems } from '../ducks/communicationPreferences';
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

// reduce groups to only those that have one of the channel ids in the channels array
const useReduceGroupsForSupportedChannels = (groups, channels) => {
  const items = useSelector(selectItems);

  return Object.entries(groups.entities).reduce(
    (acc, [id, group]) => {
      const groupActive = group.items.reduce((itemAcc, itemId) => {
        const item = items.entities[itemId];
        const supportedChannels = item.channels.filter(
          itemChannel =>
            channels.filter(
              channelId => channelId === itemChannel.endsWith(channelId),
            ).length > 0,
        );

        if (supportedChannels.length > 0) {
          return true;
        }

        return itemAcc;
      }, false);

      if (groupActive) {
        acc.ids.push(id);
        acc.entities[id] = group;
      }

      return acc;
    },
    {
      ids: [],
      entities: {},
    },
  );
};

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

  const useAllReducedGroupsForSupportedChannelsAndToggles = groups => {
    const reducedGroups = useReducedGroups(groups);

    const channels = channelsWithContactInfo;

    return useReduceGroupsForSupportedChannels(reducedGroups, channels);
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
    getAllReducedGroupsForSupportedChannelsAndToggles: useAllReducedGroupsForSupportedChannelsAndToggles,
    channelsWithContactInfo,
    toggles,
  };
};
