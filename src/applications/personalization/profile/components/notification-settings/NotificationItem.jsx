import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { selectItemById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';
import {
  NOTIFICATION_CHANNEL_IDS,
  NOTIFICATION_ITEM_DESCRIPTIONS,
} from '@@profile/constants';

import {
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';

import { LOADING_STATES } from '~/applications/personalization/common/constants';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NotificationChannel from './NotificationChannel';
import { useNotificationSettingsUtils } from '../../hooks';

const getChannelsByItemId = (itemId, channelEntities) => {
  return Object.values(channelEntities).filter(
    channel => channel.parentItem === itemId,
  );
};

const NotificationItem = ({ channelIds, itemName, itemId }) => {
  const {
    profileShowMhvNotificationSettingsEmailAppointmentReminders: aptReminderToggle,
    profileShowMhvNotificationSettingsEmailRxShipment: shipmentToggle,
  } = useNotificationSettingsUtils().toggles;

  // Determine which toggle applies based on itemId
  const emailNotificationsEnabled = (() => {
    switch (itemId) {
      case 'item3':
        return aptReminderToggle;
      case 'item4':
        return shipmentToggle;
      default:
        return true;
    }
  })();

  const description = NOTIFICATION_ITEM_DESCRIPTIONS[itemId];
  const mobilePhone = useSelector(state => selectVAPMobilePhone(state));

  // this is filtering all the channels that end with 1, which is the text channel
  // once the support for email is added, we'll need to remove this filter along with the feature toggle reliance
  const filteredChannels = useMemo(
    () => {
      return channelIds.filter(channelId => {
        // Do not include texting to international
        if (
          channelId.endsWith(NOTIFICATION_CHANNEL_IDS.TEXT) &&
          mobilePhone?.isInternational
        ) {
          return false;
        }
        return emailNotificationsEnabled
          ? channelId
          : channelId.endsWith(NOTIFICATION_CHANNEL_IDS.TEXT);
      });
    },
    [channelIds, emailNotificationsEnabled, mobilePhone],
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

  // need to do this otherwise we will see Appointment Reminder and Shipment item title only without any checkbox
  const shouldBlock =
    userHasAtLeastOneChannelContactInfo &&
    ((itemId === 'item3' && !aptReminderToggle) ||
      (itemId === 'item4' && !shipmentToggle)) &&
    !mobilePhone;

  if (shouldBlock) return null;

  // Ensure "empty `filterChannels`" will not render an empty fieldset wrapper
  // This is its own condition since `userHasAtLeastOneChannelContactInfo`
  // can still be true when filterChannels length is 0
  if (filteredChannels.length === 0) {
    return null;
  }

  return (
    <>
      {userHasAtLeastOneChannelContactInfo ? (
        <VaCheckboxGroup
          label={itemName}
          label-header-level="3"
          hint={description}
          data-testid={`checkbox-group-${itemId}`}
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
        </VaCheckboxGroup>
      ) : null}
    </>
  );
};

NotificationItem.propTypes = {
  channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemId: PropTypes.string.isRequired,
  itemName: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const communicationPreferencesState = selectCommunicationPreferences(state);

  const item = selectItemById(communicationPreferencesState, ownProps.itemId);

  return {
    item,
    itemName: item.name,
    channelIds: item.channels,
  };
};

export default connect(mapStateToProps)(NotificationItem);
