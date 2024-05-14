import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import { GA_PREFIX } from '../../../utils/constants';
import RemoveProviderModal from './RemoveProviderModal';

export default function SelectedProvider({
  formData,
  initialProviderDisplayCount,
  onChange,
  providerSelected,
  setCheckedProvider,
  setProvidersListLength,
  setShowProvidersList,
}) {
  const { address, sortMethod } = useSelector(
    selectProviderSelectionInfo,
    shallowEqual,
  );
  const [showRemoveProviderModal, setShowRemoveProviderModal] = useState(false);

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 medium-screen:vads-u-padding--3">
      {!providerSelected && (
        <button
          className="va-button-link"
          type="button"
          aria-describedby="providerSelectionDescription"
          onClick={() => {
            setShowProvidersList(true);
            recordEvent({ event: `${GA_PREFIX}-choose-provider-click` });
          }}
        >
          <va-icon icon="add" size="3" aria-hidden="true" />
          Find a provider
        </button>
      )}
      {providerSelected && (
        <section id="selectedProvider" aria-label="Selected provider">
          <h2
            id="providerPostSelectionHeader"
            className="vads-u-font-size--h3 vads-u-margin-top--0"
          >
            Preferred provider
          </h2>
          <span className="vads-u-display--block">{formData.name}</span>
          <span className="vads-u-display--block">
            {formData.address?.city}, {formData.address?.state}
          </span>
          <span>{`${formData[sortMethod]} miles`}</span>
          <div className="vads-u-display--flex vads-u-margin-top--1">
            <button
              type="button"
              className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0 vads-u-margin-right--2"
              onClick={() => {
                setProvidersListLength(initialProviderDisplayCount);
                setShowProvidersList(true);
              }}
            >
              Change provider
            </button>
            <button
              aria-label={`Remove ${formData.name}`}
              type="button"
              className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0 vads-u-margin-right--2"
              onClick={() => {
                setShowRemoveProviderModal(true);
              }}
            >
              Remove
            </button>
          </div>
        </section>
      )}
      {showRemoveProviderModal && (
        <RemoveProviderModal
          provider={formData}
          address={address}
          onClose={response => {
            setShowRemoveProviderModal(false);
            if (response === true) {
              setCheckedProvider(false);
              onChange({});
            }
          }}
        />
      )}
    </div>
  );
}

SelectedProvider.propTypes = {
  formData: PropTypes.object,
  initialProviderDisplayCount: PropTypes.number,
  providerSelected: PropTypes.bool,
  setCheckedProvider: PropTypes.func,
  setProvidersListLength: PropTypes.func,
  setShowProvidersList: PropTypes.func,
  onChange: PropTypes.func,
};
