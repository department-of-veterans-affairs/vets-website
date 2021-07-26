import React from 'react';
import { connect } from 'react-redux';

import {
  selectItemById,
  selectChannelById,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import { getContactInfoSelectorByChannelType } from '@@profile/util/notification-settings';

import NotificationChannelUnavailable from './NotificationChannelUnavailable';

const checkboxLabels = {
  1: 'Notify by text',
  2: 'Notify by email',
};

const channelTypes = {
  1: 'text',
  2: 'email',
};

const NotificationChannel = ({
  channelId,
  channelType,
  isMissingContactInfo,
  isOptedIn,
  itemName,
}) => {
  if (isMissingContactInfo) {
    return <NotificationChannelUnavailable channelType={channelType} />;
  }
  const checkboxAriaLabel = `Notify me of ${itemName} by ${
    channelTypes[channelType]
  }`;
  return (
    <div>
      <input
        type="checkbox"
        id={channelId}
        onChange={() => {}}
        checked={isOptedIn}
      />
      <label
        htmlFor={channelId}
        aria-label={checkboxAriaLabel}
        className="vads-u-margin-y--1"
      >
        {checkboxLabels[channelType]}
      </label>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const channel = selectChannelById(
    communicationPreferencesState,
    ownProps.channelId,
  );
  const item = selectItemById(
    communicationPreferencesState,
    channel.parentItem,
  );
  const contactInfoSelector = getContactInfoSelectorByChannelType(
    channel.channelType,
  );
  const isMissingContactInfo = !contactInfoSelector(state);
  return {
    channelType: channel.channelType,
    itemName: item.name,
    isOptedIn: channel.isAllowed,
    isMissingContactInfo,
  };
};

export default connect(mapStateToProps)(NotificationChannel);
