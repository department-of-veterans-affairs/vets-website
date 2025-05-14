import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import {
  selectChannelById,
  selectItemById,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';
import {
  RX_TRACKING_SUPPORTING_FACILITIES,
  NOTIFICATION_CHANNEL_IDS,
} from '@@profile/constants';

import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import {
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';

import { LOADING_STATES } from '~/applications/personalization/common/constants';
import NotificationChannel from './NotificationChannel';
import { NotificationChannelCheckboxesFieldset } from './NotificationChannelCheckboxesFieldset';
import { useNotificationSettingsUtils } from '../../hooks';
import FacilityClinicDetailsOptIn from './FacilityClinicDetailsOptIn';

const getChannelsByItemId = (itemId, channelEntities) => {
  return Object.values(channelEntities).filter(
    channel => channel.parentItem === itemId,
  );
};

const NotificationItem = ({
  channelIds,
  itemName,
  description,
  itemId,
  // hasSensitiveIndicator,
}) => {
  const {
    profileShowMhvNotificationSettingsEmailAppointmentReminders: aptReminderToggle,
    profileShowMhvNotificationSettingsEmailRxShipment: shipmentToggle,
    showSensitiveIndicator: profileShowSensitiveIndicator,
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

  const channelSensitiveIndicators = useSelector(state =>
    filteredChannels.reduce((acc, channelId) => {
      const channel = selectChannelById(
        selectCommunicationPreferences(state),
        channelId,
      );
      acc[channelId] = channel?.sensitiveIndicator || false;
      return acc;
    }, {}),
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
  // console.log(channelsByItemId, getChannelsByItemId());

  // need to do this otherwise we will see Appointment Reminder and Shipment item title only without any checkbox
  const mobilePhone = useSelector(state => selectVAPMobilePhone(state));
  const shouldBlock =
    userHasAtLeastOneChannelContactInfo &&
    ((itemId === 'item3' && !aptReminderToggle) ||
      (itemId === 'item4' && !shipmentToggle)) &&
    !mobilePhone;

  if (shouldBlock) return null;

  const groupedChannels = filteredChannels.reduce((acc, channelId) => {
    const [facilityId] = channelId.split('-');

    if (!acc[facilityId]) {
      acc[facilityId] = [];
    }
    acc[facilityId].push(channelId);

    return acc;
  }, {});

  const uniqueChannelGroups = Object.entries(groupedChannels);

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
          {/* move down to notification channel level */}
          {true && profileShowSensitiveIndicator
            ? uniqueChannelGroups.map(([channelItemId, channels]) => {
                // skip rendering if no channel has a sensitive indicator
                const hasSensitiveIndicator = channels.some(
                  channelId => channelSensitiveIndicators[channelId],
                );

                if (!hasSensitiveIndicator) {
                  return null;
                }

                return (
                  <FacilityClinicDetailsOptIn
                    id={channelItemId}
                    detailsText="You can opt in to include facility and clinic details in your reminders."
                    descriptionText="The clinic name may include the type of care you’re receiving, such as &quot;cardiology.&quot;"
                    channelIds={channels}
                    key={channelItemId}
                    channelsByItemId={channelsByItemId}
                    disabledForCheckbox={
                      itemStatusIndicators.hasSomePendingUpdates
                    }
                  />
                );
              })
            : null}
        </NotificationChannelCheckboxesFieldset>
      ) : null}
    </>
  );
};

NotificationItem.propTypes = {
  channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemId: PropTypes.string.isRequired,
  channelType: PropTypes.number,
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
