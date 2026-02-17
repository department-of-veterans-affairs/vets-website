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

import {
  VaAlert,
  VaButton,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import classNames from 'classnames';
import { LOADING_STATES } from '../../../common/constants';

import {
  NOTIFICATION_CHANNEL_FIELD_DESCRIPTIONS,
  NOTIFICATION_CHANNEL_LABELS,
} from '../../constants';

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
    saveSetting,
    disabledForCheckbox,
    last,
    defaultSendIndicator,
  } = props;

  const checked = React.useMemo(() => {
    if (isOptedIn === null) {
      return defaultSendIndicator;
    }
    return !!isOptedIn;
  }, [isOptedIn, defaultSendIndicator]);

  // when itemId = "item2", itemIdNumber will be 2
  const itemIdNumber = React.useMemo(() => {
    if (itemId) {
      const matches = itemId.match(/\d+/) || [];
      const matchedNumber = matches[0];
      return parseInt(matchedNumber, 10);
    }
    return null;
  }, [itemId]);

  const label = `Notify me by ${NOTIFICATION_CHANNEL_LABELS[channelType]}`;
  const description = NOTIFICATION_CHANNEL_FIELD_DESCRIPTIONS[channelId];

  const handleChange = e => {
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
  };

  const apiStatusInfo = React.useMemo(() => {
    return {
      warningMessage:
        !permissionId && apiStatus === LOADING_STATES.idle
          ? 'Select an option.'
          : null,
      loadingMessage: apiStatus === LOADING_STATES.pending ? 'Saving...' : null,
      errorMessage:
        apiStatus === LOADING_STATES.error
          ? 'We’re sorry. We had a problem saving your update. Try again.'
          : null,
      successMessage:
        apiStatus === LOADING_STATES.loaded ? 'Update saved' : null,
      isDisabled: apiStatus === LOADING_STATES.pending,
    };
  }, [apiStatus, permissionId]);

  if (isMissingContactInfo) {
    return null;
  }

  const className = classNames({
    'vads-u-padding-bottom--0p5': last,
    'vads-u-display--none': apiStatusInfo.loadingMessage,
  });

  return (
    <>
      {apiStatusInfo.successMessage && (
        <VaAlert
          slim
          status="success"
          class="vads-u-margin-top--2 vads-u-margin-bottom--2"
          data-testid={`success-${channelId}`}
        >
          {apiStatusInfo.successMessage}
        </VaAlert>
      )}
      {apiStatusInfo.errorMessage && (
        <VaAlert
          slim
          status="error"
          class="vads-u-margin-top--2 vads-u-margin-bottom--2"
          data-testid={`error-${channelId}`}
        >
          {apiStatusInfo.errorMessage}
        </VaAlert>
      )}
      {apiStatusInfo.loadingMessage && (
        <VaButton
          disabled
          text={apiStatusInfo.loadingMessage}
          loading
          data-testid={`loading-${channelId}`}
        />
      )}
      <VaCheckbox
        label={label}
        checked={checked}
        checkboxDescription={description}
        onVaChange={e => handleChange(e)}
        disabled={disabledForCheckbox}
        className={className}
        data-testid={`checkbox-${channelId}`}
      />
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
