import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  saveCommunicationPreferenceChannel,
  selectChannelById,
  selectItemById,
} from '@@profile/ducks/communicationPreferences';
import CommunicationChannelModel from '@@profile/models/CommunicationChannel';
import recordEvent from '~/platform/monitoring/record-event';
import { NotificationCheckbox } from '../notification-settings/NotificationCheckbox';
import { LOADING_STATES } from '../../../common/constants';
import { NotificationChannelCheckboxesFieldset } from '../notification-settings/NotificationChannelCheckboxesFieldset';

export const Document = ({ document }) => {
  const dispatch = useDispatch();
  const item = useSelector(state =>
    selectItemById(state.communicationPreferences, document),
  );
  const channel = useSelector(state =>
    selectChannelById(state.communicationPreferences, item.channels[0]),
  );

  const {
    channelType,
    defaultSendIndicator,
    isAllowed,
    parentItem,
    permissionId,
    ui: { updateStatus },
  } = channel;

  const parentItemId = parseInt(parentItem.replace(/\D+/g, ''), 10);

  const itemStatusIndicators = {
    hasSomeErrorUpdates: channel.ui.updateStatus === LOADING_STATES.error,
    hasSomePendingUpdates: channel.ui.updateStatus === LOADING_STATES.pending,
    hasSomeSuccessUpdates: channel.ui.updateStatus === LOADING_STATES.loaded,
  };

  const {
    hasSomeErrorUpdates,
    hasSomePendingUpdates,
    hasSomeSuccessUpdates,
  } = itemStatusIndicators;

  const apiStatusInfo = {
    loadingMessage:
      updateStatus === LOADING_STATES.pending ? 'Saving...' : null,
    errorMessage:
      updateStatus === LOADING_STATES.error
        ? 'We’re sorry. We had a problem saving your update. Try again.'
        : null,
    successMessage:
      updateStatus === LOADING_STATES.loaded ? 'Update saved.' : null,
    isDisabled: updateStatus === LOADING_STATES.pending,
  };

  const {
    errorMessage,
    loadingMessage,
    successMessage,
    isDisabled,
  } = apiStatusInfo;

  return (
    <div className="vads-u-margin-left--1p5">
      <NotificationChannelCheckboxesFieldset
        hasSomeErrorUpdates={hasSomeErrorUpdates}
        hasSomePendingUpdates={hasSomePendingUpdates}
        hasSomeSuccessUpdates={hasSomeSuccessUpdates}
      >
        <NotificationCheckbox
          label={item.name}
          isOptedIn={isAllowed}
          defaultSendIndicator={defaultSendIndicator}
          channelId={item.channels[0]}
          onValueChange={e => {
            const newValue = e.target.checked;

            // Escape early if no change was made. If an API call fails, it's
            // possible to then click on a "checked" radio button to fire off
            // another API call. This check avoids that problem
            if (newValue === isAllowed) {
              return;
            }

            const model = new CommunicationChannelModel({
              type: channelType,
              parentItemId,
              permissionId,
              isAllowed: newValue,
              wasAllowed: isAllowed,
            });

            const eventPayload = {
              event: 'int-checkbox-group-option-click',
              'checkbox-group-optionLabel': `${item.name} - ${newValue}`,
              'checkbox-group-label': item.name,
              'checkbox-group-required': '-',
            };

            recordEvent(eventPayload);

            dispatch(
              saveCommunicationPreferenceChannel(
                item.channels[0],
                model.getApiCallObject(),
              ),
            );
          }}
          loadingMessage={loadingMessage}
          successMessage={successMessage}
          errorMessage={errorMessage}
          disabled={isDisabled}
          last={false}
        />
      </NotificationChannelCheckboxesFieldset>
    </div>
  );
};

Document.propTypes = {
  document: PropTypes.string,
};
