import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  saveCommunicationPreferenceChannel,
  selectChannelById,
  selectItemById,
} from '@@profile/ducks/communicationPreferences';
import CommunicationChannelModel from '@@profile/models/CommunicationChannel';
import recordEvent from '~/platform/monitoring/record-event';
import { LOADING_STATES } from '../../../common/constants';
import { LoadingButton } from './LoadingButton';
import { CheckboxAlert } from './CheckboxAlert';

export const Document = ({ document }) => {
  const dispatch = useDispatch();
  const item = useSelector(state =>
    selectItemById(state.communicationPreferences, document),
  );
  const channel = useSelector(state =>
    selectChannelById(state.communicationPreferences, item.channels[0]),
  );
  const channelId = useSelector(
    state =>
      state.communicationPreferences.items.entities[document].channels[0],
  );
  const {
    channelType,
    defaultSendIndicator,
    isAllowed,
    parentItem,
    permissionId,
    ui: { updateStatus } = {},
  } = channel || {};
  const error = updateStatus === LOADING_STATES.error;
  const loading = updateStatus === LOADING_STATES.pending;
  const success = updateStatus === LOADING_STATES.loaded;
  const checked = isAllowed === null ? defaultSendIndicator : !!isAllowed;
  const parentItemId = parentItem
    ? parseInt(parentItem.replace(/\D+/g, ''), 10)
    : null;
  const checkboxClassName = classNames('vads-u-margin-bottom--0', {
    'vads-u-display--none': loading,
  });

  const handleChange = e => {
    const newValue = e.detail.checked;
    if (newValue === isAllowed) {
      return;
    }
    const model = new CommunicationChannelModel({
      isAllowed: newValue,
      parentItemId,
      permissionId,
      type: channelType,
      wasAllowed: isAllowed,
    });
    const eventPayload = {
      event: 'int-checkbox-group-option-click',
      'checkbox-group-label': item.name,
      'checkbox-group-optionLabel': `${item.name} - ${newValue}`,
      'checkbox-group-required': '-',
    };
    recordEvent(eventPayload);
    dispatch(
      saveCommunicationPreferenceChannel(channelId, model.getApiCallObject()),
    );
  };

  return (
    <>
      <CheckboxAlert error={error} success={success} />
      {loading && <LoadingButton />}
      <VaCheckbox
        checked={checked}
        className={checkboxClassName}
        id={`paperless-checkbox-${item.name}`}
        label={item.name}
        onVaChange={handleChange}
      />
    </>
  );
};

Document.propTypes = {
  document: PropTypes.string.isRequired,
};
