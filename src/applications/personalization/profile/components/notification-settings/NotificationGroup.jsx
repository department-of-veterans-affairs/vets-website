import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectGroupById } from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import NotificationItem from './NotificationItem';
import {
  BLOCKED_MHV_NOTIFICATION_IDS,
  NOTIFICATION_GROUPS,
} from '../../constants';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

const shouldRenderGroup = ({
  groupId,
  profileShowPaymentsNotificationSetting,
  profileShowMhvNotificationSettings,
}) => {
  if (groupId === NOTIFICATION_GROUPS.PAYMENTS) {
    return profileShowPaymentsNotificationSetting;
  }

  if (groupId === NOTIFICATION_GROUPS.GENERAL) {
    return profileShowMhvNotificationSettings;
  }

  return true;
};

const NotificationGroup = ({ children, groupName, itemIds, groupId }) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();

  const showPaymentsNotificationSetting = useToggleValue(
    TOGGLE_NAMES.profileShowPaymentsNotificationSetting,
  );

  const showMhvNotificationSettings = useToggleValue(
    TOGGLE_NAMES.profileShowMhvNotificationSettings,
  );

  const shouldRender = useMemo(
    () => {
      return shouldRenderGroup({
        groupId,
        profileShowPaymentsNotificationSetting: showPaymentsNotificationSetting,
        profileShowMhvNotificationSettings: showMhvNotificationSettings,
      });
    },
    [groupId, showPaymentsNotificationSetting, showMhvNotificationSettings],
  );

  const filteredItemIds = useMemo(
    () => {
      return showMhvNotificationSettings
        ? itemIds
        : itemIds.filter(itemId => {
            return !BLOCKED_MHV_NOTIFICATION_IDS.includes(itemId);
          });
    },
    [itemIds, showMhvNotificationSettings],
  );

  return shouldRender ? (
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
  ) : null;
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
