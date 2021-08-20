import React from 'react';
import { connect } from 'react-redux';

import { selectItemById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import NotificationChannel from './NotificationChannel';

const NotificationItem = ({ channelIds }) => {
  return (
    <div>
      {/* Leaving this here for future reference since we might need to bring the item name back to this component. Not that to re-enable the h3, we need to add itemName to the destructured props up on line 9 */}
      {/* <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-top--2">
        {itemName}
      </h3> */}

      {channelIds.map(channelId => (
        <NotificationChannel channelId={channelId} key={channelId} />
      ))}
    </div>
  );
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
