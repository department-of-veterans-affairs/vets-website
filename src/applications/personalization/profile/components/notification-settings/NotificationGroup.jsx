import React from 'react';
import { connect } from 'react-redux';

import { selectGroupById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import NotificationItem from './NotificationItem';

const NotificationGroup = ({ children, groupName, itemIds }) => {
  return (
    <div data-testid="notification-group">
      <h2 className="vads-u-font-size--h3">{groupName}</h2>
      {itemIds.map(itemId => {
        return <NotificationItem key={itemId} itemId={itemId} />;
      })}
      {children}
      <hr className="vads-u-margin-y--2" />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const group = selectGroupById(
    communicationPreferencesState,
    ownProps.groupId,
  );
  return {
    groupName: group.name,
    itemIds: group.items,
  };
};

export default connect(mapStateToProps)(NotificationGroup);
