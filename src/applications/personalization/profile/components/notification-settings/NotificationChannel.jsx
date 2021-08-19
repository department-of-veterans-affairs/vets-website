import React from 'react';
import { connect } from 'react-redux';

import CommunicationChannelModel from '@@profile/models/CommunicationChannel';
import {
  saveCommunicationPreferenceChannel,
  selectItemById,
  selectChannelById,
  selectChannelUiById,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import { getContactInfoSelectorByChannelType } from '@@profile/util/notification-settings';

import { LOADING_STATES } from '../../../common/constants';

import NotificationChannelUnavailable from './NotificationChannelUnavailable';

const checkboxLabels = {
  1: 'Notify by text',
  2: 'Notify by email',
};

const channelTypes = {
  1: 'text',
  2: 'email',
};

const SavingIndicator = () => {
  return (
    <span>
      <i
        className="fa fa-spinner fa-spin"
        aria-hidden="true"
        role="presentation"
      />
      Saving...
    </span>
  );
};

const SuccessIndicator = ({ channelType }) => {
  return (
    <span>
      You’ve updated your VA {channelTypes[channelType]} notifications.
    </span>
  );
};

const ErrorIndicator = () => {
  return (
    <span>
      We’re sorry. We can’t save your update at this time. Please try again.
    </span>
  );
};

const NotificationChannel = ({
  apiStatus,
  channelId,
  channelType,
  isMissingContactInfo,
  isOptedIn,
  itemName,
  itemId,
  permissionId,
  saveSetting,
}) => {
  // when parentItem = "item2", parentItemId will be 2
  const itemIdNumber = React.useMemo(
    () => {
      if (itemId) {
        const matches = itemId.match(/\d+/) || [];
        const matchedNumber = matches[0];
        return parseInt(matchedNumber, 10);
      }
      return null;
    },
    [itemId],
  );

  const checkboxAriaLabel = React.useMemo(
    () => `Notify me of ${itemName} by ${channelTypes[channelType]}`,
    [itemName, channelType],
  );

  if (isMissingContactInfo) {
    return <NotificationChannelUnavailable channelType={channelType} />;
  }
  return (
    <div>
      {!permissionId ? (
        <p className="vads-u-color--secondary-dark">
          <strong>We do not have a preference for you</strong>
        </p>
      ) : null}
      <input
        type="checkbox"
        id={channelId}
        onChange={e => {
          const model = new CommunicationChannelModel({
            type: channelType,
            parentItemId: itemIdNumber,
            permissionId,
            isAllowed: e.currentTarget.checked,
          });
          saveSetting(channelId, model.getApiCallObject());
        }}
        checked={isOptedIn}
        disabled={apiStatus === LOADING_STATES.pending}
      />
      <label
        htmlFor={channelId}
        aria-label={checkboxAriaLabel}
        className="vads-u-margin-y--1"
      >
        {checkboxLabels[channelType]}
      </label>
      <div>
        {apiStatus === LOADING_STATES.pending ? <SavingIndicator /> : null}
        {apiStatus === LOADING_STATES.error ? <ErrorIndicator /> : null}
        {apiStatus === LOADING_STATES.loaded ? (
          <SuccessIndicator channelType={channelType} />
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const channel = selectChannelById(
    communicationPreferencesState,
    ownProps.channelId,
  );
  const uiState = selectChannelUiById(
    communicationPreferencesState,
    ownProps.channelId,
  );
  const itemId = channel.parentItem;
  const item = selectItemById(communicationPreferencesState, itemId);
  const contactInfoSelector = getContactInfoSelectorByChannelType(
    channel.channelType,
  );
  const isMissingContactInfo = !contactInfoSelector(state);
  return {
    apiStatus: uiState.updateStatus,
    channelType: channel.channelType,
    itemName: item.name,
    itemId,
    isOptedIn: channel.isAllowed,
    isMissingContactInfo,
    permissionId: channel.permissionId,
  };
};

const mapDispatchToProps = {
  saveSetting: saveCommunicationPreferenceChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationChannel);
