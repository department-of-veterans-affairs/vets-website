import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { selectItemById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';
import {
  RX_TRACKING_SUPPORTING_FACILITIES,
  NOTIFICATION_CHANNEL_IDS,
} from '@@profile/constants';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import {
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';

import NotificationChannel from './NotificationChannel';
import { NotificationChannelCheckboxesFieldset } from './NotificationChannelCheckboxesFieldset';
import { LOADING_STATES } from '~/applications/personalization/common/constants';

const getChannelsByItemId = (itemId, channelEntities) => {
  return Object.values(channelEntities).filter(
    channel => channel.parentItem === itemId,
  );
};

const NotificationItem = ({ channelIds, itemName, description, itemId }) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const emailNotificationsEnabled = useToggleValue(
    TOGGLE_NAMES.profileShowEmailNotificationSettings,
  );
  // this is filtering all the channels that end with 1, which is the text channel
  // once the support for email is added, we'll need to remove this filter along with the feature toggle reliance
  const filteredChannels = useMemo(
    () => {
      return channelIds.filter(channelId => {
        return emailNotificationsEnabled
          ? channelId
          : channelId.endsWith(NOTIFICATION_CHANNEL_IDS.TEXT);
      });
    },
    [channelIds, emailNotificationsEnabled],
  );

  const channelsByItemId = useSelector(state =>
    getChannelsByItemId(
      itemId,
      state?.communicationPreferences?.channels?.entities,
    ),
  );

  const userHasAtLeastOneChannelContactInfo = useSelector(state => {
    const setUpChannels = [
      ...(selectVAPEmailAddress(state)
        ? [parseInt(NOTIFICATION_CHANNEL_IDS.EMAIL, 10)]
        : []),
      ...(selectVAPMobilePhone(state)
        ? [parseInt(NOTIFICATION_CHANNEL_IDS.TEXT, 10)]
        : []),
    ];

    return channelsByItemId.some(({ channelType }) => {
      return setUpChannels.includes(channelType);
    });
  });

  // used for reflecting some ui state on a whole item level
  // for checkboxes this is important for allowing checkboxes
  // to be disabled when there are pending updates
  const itemStatusIndicators = useMemo(
    () => {
      return {
        hasSomeSuccessUpdates: channelsByItemId.some(
          channel => channel.ui.updateStatus === LOADING_STATES.loaded,
        ),
        hasSomeErrorUpdates: channelsByItemId.some(
          channel => channel.ui.updateStatus === LOADING_STATES.error,
        ),
        hasSomePendingUpdates: channelsByItemId.some(
          channel => channel.ui.updateStatus === LOADING_STATES.pending,
        ),
      };
    },
    [channelsByItemId],
  );

  return (
    <>
      {userHasAtLeastOneChannelContactInfo ? (
        <NotificationChannelCheckboxesFieldset
          itemName={itemName}
          description={description}
          channels={filteredChannels}
          itemId={itemId}
          hasSomeErrorUpdates={itemStatusIndicators.hasSomeErrorUpdates}
          hasSomePendingUpdates={itemStatusIndicators.hasSomePendingUpdates}
          hasSomeSuccessUpdates={itemStatusIndicators.hasSomeSuccessUpdates}
        >
          {filteredChannels.map((channelId, index) => (
            <NotificationChannel
              channelId={channelId}
              key={channelId}
              disabledForCheckbox={itemStatusIndicators.hasSomePendingUpdates}
              last={index === filteredChannels.length - 1}
              itemName={itemName}
            />
          ))}
        </NotificationChannelCheckboxesFieldset>
      ) : null}
    </>
  );
};

NotificationItem.propTypes = {
  channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemId: PropTypes.string.isRequired,
  description: PropTypes.string,
  itemName: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const communicationPreferencesState = selectCommunicationPreferences(state);

  const item = selectItemById(communicationPreferencesState, ownProps.itemId);

  const allFacilitiesSupportRxTracking = selectPatientFacilities(
    state,
  )?.every?.(facility => {
    return RX_TRACKING_SUPPORTING_FACILITIES.has(facility.facilityId);
  });

  const description =
    item.channels.some(channel => channel.includes('channel4')) &&
    !allFacilitiesSupportRxTracking
      ? 'Only available at some VA health facilities. Check with your VA pharmacy first.'
      : null;

  return {
    item,
    itemName: item.name,
    channelIds: item.channels,
    description,
  };
};

export default connect(mapStateToProps)(NotificationItem);
