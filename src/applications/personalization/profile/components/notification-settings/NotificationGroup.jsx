import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectGroupById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import { selectShowAppealStatusNotificationSetting } from '../../selectors';

import NotificationItem from './NotificationItem';
import { NOTIFICATION_GROUPS } from '../../constants';

const appealStatusNotificationId = 'item6';

const NotificationGroup = ({
  children,
  groupName,
  itemIds,
  shouldShowAppealStatusNotificationSetting,
}) => {
  return (
    <div data-testid="notification-group">
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--4 vads-u-margin-bottom--1p5">
        {groupName}
      </h2>
      <div className="vads-u-margin-left--1p5">
        {itemIds.map(itemId => {
          if (
            !shouldShowAppealStatusNotificationSetting &&
            itemId === appealStatusNotificationId
          ) {
            return null;
          }
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
  const shouldShowAppealStatusNotificationSetting =
    selectShowAppealStatusNotificationSetting(state) &&
    ownProps.groupId === NOTIFICATION_GROUPS.APPLICATIONS;
  const itemIds = group.items;
  return {
    groupName: group.name,
    itemIds,
    shouldShowAppealStatusNotificationSetting,
  };
};

NotificationGroup.propTypes = {
  groupName: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  itemIds: PropTypes.arrayOf(PropTypes.string),
  shouldShowAppealStatusNotificationSetting: PropTypes.bool,
};

export default connect(mapStateToProps)(NotificationGroup);
