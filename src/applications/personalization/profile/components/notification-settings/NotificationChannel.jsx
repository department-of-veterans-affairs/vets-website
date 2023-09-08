import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommunicationChannelModel from '@@profile/models/CommunicationChannel';
import {
  saveCommunicationPreferenceChannel,
  selectChannelById,
  selectChannelUiById,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import { getContactInfoSelectorByChannelType } from '@@profile/util/notification-settings';

import recordEvent from '~/platform/monitoring/record-event';
import { Toggler } from '~/platform/utilities/feature-toggles';

import { LOADING_STATES } from '../../../common/constants';

import NotificationRadioButtons from './NotificationRadioButtons';
import { NotificationCheckbox } from './NotificationCheckbox';
import { NOTIFICATION_CHANNEL_LABELS } from '../../constants';

const channelTypes = {
  1: 'text',
  2: 'email',
};

const NotificationChannel = props => {
  const {
    apiStatus,
    channelId,
    channelType,
    isMissingContactInfo,
    isOptedIn,
    itemName,
    itemId,
    permissionId,
    description,
    saveSetting,
    disabledForCheckbox,
    last,
    defaultSendIndicator,
  } = props;
  // when itemId = "item2", itemIdNumber will be 2
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

  const apiStatusInfo = React.useMemo(
    () => {
      return {
        warningMessage:
          !permissionId && apiStatus === LOADING_STATES.idle
            ? 'Select an option.'
            : null,
        loadingMessage:
          apiStatus === LOADING_STATES.pending ? 'Saving...' : null,
        errorMessage:
          apiStatus === LOADING_STATES.error
            ? 'We’re sorry. We had a problem saving your update. Try again.'
            : null,
        successMessage:
          apiStatus === LOADING_STATES.loaded ? 'Update saved.' : null,
        isDisabled: apiStatus === LOADING_STATES.pending,
      };
    },
    [apiStatus, permissionId],
  );

  if (isMissingContactInfo) {
    return null;
  }

  const label = `Notify me by ${NOTIFICATION_CHANNEL_LABELS[channelType]}`;

  return (
    <>
      <Toggler
        toggleName={
          Toggler.TOGGLE_NAMES.profileUseNotificationSettingsCheckboxes
        }
      >
        <Toggler.Enabled>
          <NotificationCheckbox
            label={label}
            isOptedIn={isOptedIn}
            defaultSendIndicator={defaultSendIndicator}
            channelId={channelId}
            onValueChange={e => {
              const newValue = e.target.checked;

              // Escape early if no change was made. If an API call fails, it's
              // possible to then click on a "checked" radio button to fire off
              // another API call. This check avoids that problem
              if (newValue === isOptedIn) {
                return;
              }

              const model = new CommunicationChannelModel({
                type: channelType,
                parentItemId: itemIdNumber,
                permissionId,
                isAllowed: newValue,
                wasAllowed: isOptedIn,
              });

              const eventPayload = {
                event: 'int-checkbox-group-option-click',
                'checkbox-group-optionLabel': `${label} - ${newValue}`,
                'checkbox-group-label': itemName,
                'checkbox-group-required': '-',
              };

              recordEvent(eventPayload);

              saveSetting(channelId, model.getApiCallObject());
            }}
            loadingMessage={apiStatusInfo.loadingMessage}
            successMessage={apiStatusInfo.successMessage}
            errorMessage={apiStatusInfo.errorMessage}
            disabled={disabledForCheckbox}
            last={last}
          />
        </Toggler.Enabled>

        <Toggler.Disabled>
          <NotificationRadioButtons
            id={channelId}
            value={{ value: currentValue }}
            label={itemName}
            name={`${itemName}-${channelType}`}
            description={description}
            options={[
              {
                label,
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
              recordEvent({
                event: 'int-radio-button-option-click',
                'radio-button-label': itemName,
                'radio-button-optionLabel': `${
                  channelTypes[channelType]
                } - ${newValue}`,
                'radio-button-required': false,
              });

              saveSetting(channelId, model.getApiCallObject());
            }}
            warningMessage={apiStatusInfo.warningMessage}
            loadingMessage={apiStatusInfo.loadingMessage}
            successMessage={apiStatusInfo.successMessage}
            errorMessage={apiStatusInfo.errorMessage}
            disabled={apiStatusInfo.isDisabled}
          />
        </Toggler.Disabled>
      </Toggler>
    </>
  );
};

NotificationChannel.propTypes = {
  saveSetting: PropTypes.func.isRequired,
  apiStatus: PropTypes.string,
  channelId: PropTypes.string,
  channelType: PropTypes.number,
  defaultSendIndicator: PropTypes.bool,
  description: PropTypes.string,
  disabledForCheckbox: PropTypes.bool,
  isMissingContactInfo: PropTypes.bool,
  isOptedIn: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  itemId: PropTypes.string,
  itemName: PropTypes.string,
  last: PropTypes.bool,
  permissionId: PropTypes.number,
  radioButtonDescription: PropTypes.string,
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
  const contactInfoSelector = getContactInfoSelectorByChannelType(
    channel.channelType,
  );
  const isMissingContactInfo = !contactInfoSelector(state);

  return {
    apiStatus: uiState.updateStatus,
    channelType: channel.channelType,
    itemId,
    isOptedIn: channel.isAllowed,
    isMissingContactInfo,
    permissionId: channel.permissionId,
    defaultSendIndicator: channel?.defaultSendIndicator,
  };
};

const mapDispatchToProps = {
  saveSetting: saveCommunicationPreferenceChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationChannel);
