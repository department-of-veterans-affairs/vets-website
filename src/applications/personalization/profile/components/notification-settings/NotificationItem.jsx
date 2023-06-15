import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectItemById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';
import NotificationChannel from './NotificationChannel';
import { NOTIFICATION_CHANNEL_IDS } from '../../constants';

const NotificationItem = ({ channelIds, itemName }) => {
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
          <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-top--2">
            {itemName}
          </h3>
        </Toggler.Enabled>
      </Toggler>

      {filteredChannels.map(channelId => (
        <NotificationChannel channelId={channelId} key={channelId} />
      ))}
    </>
  );
};

NotificationItem.propTypes = {
  channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemName: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const item = selectItemById(communicationPreferencesState, ownProps.itemId);
  return {
    itemName: item.name,
    channelIds: item.channels,
  };
};

export default connect(mapStateToProps)(NotificationItem);
