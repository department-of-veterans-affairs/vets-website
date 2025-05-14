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

import { LOADING_STATES } from '../../../common/constants';

import { NotificationCheckbox } from './NotificationCheckbox';
import { NOTIFICATION_CHANNEL_LABELS } from '../../constants';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings/index';

function ChannelSensitiveOptIn({ channelId, apiStatus, channel }) {
  // console.log('ChanSensitiveOptIn', channel);

  const channelTypeName = channel.channelType === 1 ? 'text' : 'email';

  return (
    <div
      className={
        'vads-u-border-left--7px vads-u-border-color--primary-alt-light vads-u-margin-top--1p5 vads-u-margin-left--4 vads-u-padding-left--1p5'
      }
    >
      <p
        className={
          'vads-u-margin-top--0 vads-u-margin-bottom--1 vads-u-line-height--3'
        }
      >
        You can opt in to include facility and clinic details in your{' '}
        {channelTypeName} reminders.
      </p>
      <p
        className={
          'vads-u-margin-top--1 vads-u-margin-bottom--1p5 vads-u-line-height--3 vads-u-color--gray-medium'
        }
      >
        The clinic name may include the type of care you're receiving, such as
        "cardiology."
      </p>
      <VaCheckbox
        id={channelId} // guessed
        // checked={matchingItem?.sensitive}
        // label={getCheckboxLabel(id)}
        label={`Include facility and clinic details in ${channelTypeName} notifications`}
        // onVaChange={e => handleCheckboxChange(e, id)}
        // disabled
        // className={type === selectedType ? 'vads-u-display--none' : ''}
      />
    </div>
  );
}

const NotificationChannel = props => {
  const {
    apiStatus,
    channelId,
    channelType,
    isMissingContactInfo,
    isOptedIn,
    sensitive,
    itemName,
    itemId,
    permissionId,
    saveSetting,
    disabledForCheckbox,
    last,
    defaultSendIndicator,
    channel,
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

  if (itemId === 'item3') {
    console.log(
      'NotiChan:',
      channelId,
      channelType,
      'item:',
      itemId,
      // itemName,
      'apiStatus:',
      apiStatus,
      'isOptedIn:',
      isOptedIn,
      'sensitive:',
      sensitive, // is op in checked or not
      'disabledForCheckbox:',
      disabledForCheckbox,
      'channel:',
      channel,
    );
  }

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
            sensitive,
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
      {/*
      attempt move in from notificationItem
      wip extract from FacilityClinicDetailsOptIn
      interested only in item: 3 channel: 1 & 2

      - sensitiveIndicator - communicationChannel.sensitiveIndicator
      - allowedChannels - communicationChannel.isAllowed
      - isOptedIn - communicationChannel.isAllowed
      */}
      {true &&
        itemId === 'item3' &&
        isOptedIn &&
        (apiStatus === LOADING_STATES.idle ||
          apiStatus === LOADING_STATES.loaded) && (
          <ChannelSensitiveOptIn
            channelId={channelId}
            apiStatus={apiStatus}
            channel={channel}
          />
        )}
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
  sensitive: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
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
  // console.log(channel);
  return {
    apiStatus: uiState.updateStatus,
    channelType: channel.channelType,
    itemId,
    isOptedIn: channel.isAllowed,
    sensitive: channel.sensitive,
    isMissingContactInfo,
    permissionId: channel.permissionId,
    defaultSendIndicator: channel?.defaultSendIndicator,
    channel,
  };
};

const mapDispatchToProps = {
  saveSetting: saveCommunicationPreferenceChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationChannel);
