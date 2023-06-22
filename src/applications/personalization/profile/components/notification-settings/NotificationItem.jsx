import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectItemById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';
import {
  RX_TRACKING_SUPPORTING_FACILITIES,
  NOTIFICATION_CHANNEL_IDS,
} from '@@profile/constants';

import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';

import NotificationChannel from './NotificationChannel';
import { NotificationChannelCheckboxesFieldset } from './NotificationChannelCheckboxesFieldset';

const NotificationItem = ({ channelIds, itemName, description }) => {
  // using the Mhv Notification Settings feature toggle to determine if we should show the email channel,
  // since the email channel is not yet supported and all Mhv notifications are email based for now
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const allEnabled = useToggleValue(
    TOGGLE_NAMES.profileShowMhvNotificationSettings,
  );
  // this is filtering all the channels that end with 1, which is the text channel
  // once the support for email is added, we'll need to remove this filter along with the feature toggle reliance
  const filteredChannels = useMemo(
    () => {
      return channelIds.filter(channelId => {
        return allEnabled
          ? channelId
          : channelId.endsWith(NOTIFICATION_CHANNEL_IDS.TEXT);
      });
    },
    [channelIds, allEnabled],
  );

  return (
    <>
      <Toggler
        toggleName={
          Toggler.TOGGLE_NAMES.profileUseNotificationSettingsCheckboxes
        }
      >
        <Toggler.Enabled>
          <NotificationChannelCheckboxesFieldset
            itemName={itemName}
            description={description}
          >
            {filteredChannels.map(channelId => (
              <NotificationChannel channelId={channelId} key={channelId} />
            ))}
          </NotificationChannelCheckboxesFieldset>
        </Toggler.Enabled>

        <Toggler.Disabled>
          {filteredChannels.map(channelId => (
            <NotificationChannel
              channelId={channelId}
              key={channelId}
              description={description}
            />
          ))}
        </Toggler.Disabled>
      </Toggler>
    </>
  );
};

NotificationItem.propTypes = {
  channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
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
