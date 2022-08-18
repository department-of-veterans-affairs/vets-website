import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectGroupById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import NotificationItem from './NotificationItem';

const NotificationGroup = ({ children, groupName, itemIds }) => {
  return (
    <div data-testid="notification-group">
      <h2 className="vads-u-font-size--h3">{groupName}</h2>
      <div className="vads-u-margin-left--1p5">
        {itemIds.map(itemId => {
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
  group: PropTypes.string.isRequired,
  itemIds: PropTypes.arrayOf(PropTypes.string),
};

export default connect(mapStateToProps)(NotificationGroup);
