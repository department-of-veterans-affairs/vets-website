import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommunicationChannelModel from '@@profile/models/CommunicationChannel';
import {
  saveCommunicationPreferenceChannel,
  selectItemById,
  selectChannelById,
  selectChannelUiById,
} from '@@profile/ducks/communicationPreferences';
import { RX_TRACKING_SUPPORTING_FACILITIES } from '@@profile/constants';
import { selectCommunicationPreferences } from '@@profile/reducers';

import { getContactInfoSelectorByChannelType } from '@@profile/util/notification-settings';

import recordEvent from '~/platform/monitoring/record-event';
import { selectPatientFacilities } from '~/platform/user/selectors';

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
  radioButtonDescription,
  saveSetting,
}) => {
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

  if (isMissingContactInfo) {
    return (
      <div className="vads-u-margin-bottom--3">
        <p className="vads-u-font-weight--bold vads-u-font-size--base vads-u-margin-y--1">
          {itemName}
        </p>
        <NotificationChannelUnavailable channelType={channelType} />
      </div>
    );
  }
  return (
    <>
      <NotificationRadioButtons
        id={channelId}
        value={{ value: currentValue }}
        label={itemName}
        name={`${itemName}-${channelType}`}
        description={radioButtonDescription}
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
    </>
  );
};

NotificationChannel.propTypes = {
  saveSetting: PropTypes.func.isRequired,
  apiStatus: PropTypes.string,
  channelId: PropTypes.string,
  channelType: PropTypes.number,
  isMissingContactInfo: PropTypes.bool,
  isOptedIn: PropTypes.bool,
  itemId: PropTypes.string,
  itemName: PropTypes.string,
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
  const item = selectItemById(communicationPreferencesState, itemId);
  const contactInfoSelector = getContactInfoSelectorByChannelType(
    channel.channelType,
  );
  const isMissingContactInfo = !contactInfoSelector(state);
  const facilities = selectPatientFacilities(state);
  const allFacilitiesSupportRxTracking = facilities?.every(facility => {
    return RX_TRACKING_SUPPORTING_FACILITIES.has(facility.facilityId);
  });
  const radioButtonDescription =
    ownProps.channelId === 'channel4-1' && !allFacilitiesSupportRxTracking
      ? 'Only available at some VA health facilities. Check with your VA pharmacy first.'
      : null;
  return {
    apiStatus: uiState.updateStatus,
    channelType: channel.channelType,
    itemName: item.name,
    itemId,
    isOptedIn: channel.isAllowed,
    isMissingContactInfo,
    permissionId: channel.permissionId,
    radioButtonDescription,
  };
};

const mapDispatchToProps = {
  saveSetting: saveCommunicationPreferenceChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationChannel);
