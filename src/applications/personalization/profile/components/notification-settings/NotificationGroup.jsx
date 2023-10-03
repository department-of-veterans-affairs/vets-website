import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectGroupById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';
import { useNotificationSettingsUtils } from '@@profile/hooks';

import NotificationItem from './NotificationItem';

const NotificationGroup = ({ children, groupName, itemIds }) => {
  const {
    useFilteredItemsForMHVNotifications,
  } = useNotificationSettingsUtils();

  const filteredItemIds = useFilteredItemsForMHVNotifications(itemIds);

  return (
    <div data-testid="notification-group">
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--4 vads-u-margin-bottom--1p5">
        {groupName}
      </h2>
      <div className="vads-u-margin-left--1p5">
        {filteredItemIds.map(itemId => {
          return <NotificationItem key={itemId} itemId={itemId} />;
        })}
        {children}
      </div>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const group = selectGroupById(
    communicationPreferencesState,
    ownProps.groupId,
  );
  const itemIds = group.items;
  return {
    groupName: group.name,
    itemIds,
  };
};

NotificationGroup.propTypes = {
  groupId: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  itemIds: PropTypes.arrayOf(PropTypes.string),
};

export default connect(mapStateToProps)(NotificationGroup);
