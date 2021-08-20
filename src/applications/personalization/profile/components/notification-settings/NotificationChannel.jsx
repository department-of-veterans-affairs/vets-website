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
import NotificationRadioButtons from './NotificationRadioButtons';

const channelTypes = {
  1: 'text',
  2: 'email',
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

  // radio button option values are strings, so we need to convert the isOptedIn
  // bool to a string
  const currentValue = React.useMemo(
    () => (isOptedIn === null ? isOptedIn : isOptedIn.toString()),
    [isOptedIn],
  );

  if (isMissingContactInfo) {
    return <NotificationChannelUnavailable channelType={channelType} />;
  }
  return (
    <div>
      <NotificationRadioButtons
        value={{ value: currentValue }}
        label={itemName}
        options={[
          {
            label: `Notify me by ${channelTypes[channelType]}`,
            value: 'true',
            ariaLabel: `Notify me of ${itemName} by ${
              channelTypes[channelType]
            }`,
          },
          {
            label: `Don’t notify me`,
            value: 'false',
            ariaLabel: `Do not notify me of ${itemName} by ${
              channelTypes[channelType]
            }`,
          },
        ]}
        onValueChange={e => {
          const newValue = e.value;
          // Escape early if no change was made. If an API call fails, it's
          // possible to then click on a "checked" radio button to fire off
          // another API call. This check avoids that problem
          if (newValue === currentValue) {
            return;
          }
          const model = new CommunicationChannelModel({
            type: channelType,
            parentItemId: itemIdNumber,
            permissionId,
            isAllowed: newValue === 'true',
            wasAllowed: currentValue,
          });
          saveSetting(channelId, model.getApiCallObject());
        }}
        warningMessage={
          !permissionId && apiStatus === LOADING_STATES.idle
            ? 'Select an option.'
            : null
        }
        loadingMessage={
          apiStatus === LOADING_STATES.pending ? 'Saving...' : null
        }
        successMessage={
          apiStatus === LOADING_STATES.loaded ? 'Update saved.' : null
        }
        errorMessage={
          apiStatus === LOADING_STATES.error
            ? 'We’re sorry. We had a problem saving your update. Try again.'
            : null
        }
        disabled={apiStatus === LOADING_STATES.pending}
      />
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
