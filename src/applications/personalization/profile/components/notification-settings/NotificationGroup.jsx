import React from 'react';
import { connect } from 'react-redux';

import {
  makeRxTrackingItemFilter,
  selectGroupById,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';
import { selectPatientFacilities } from '~/platform/user/selectors';

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
      <hr className="vads-u-margin-y--2" />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const facilities = selectPatientFacilities(state);
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const group = selectGroupById(
    communicationPreferencesState,
    ownProps.groupId,
  );
  const itemIds = group.items.filter(makeRxTrackingItemFilter(facilities));
  return {
    groupName: group.name,
    itemIds,
  };
};

export default connect(mapStateToProps)(NotificationGroup);
