import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { GA_PREFIX } from '../../../utils/constants';
import { selectProviderSelectionInfo } from '../../redux/selectors';
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
        <va-button
          secondary
          text="Choose a provider"
          onClick={() => {
            setShowProvidersList(true);
            recordEvent({ event: `${GA_PREFIX}-choose-provider-click` });
          }}
          uswds
          data-testid="choose-a-provider-button"
        />
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
          <div className="vads-u-margin-top--2 vads-l-row">
            <div className="vads-u-margin-top--1 vads-u-padding-right--1p5">
              <va-button
                secondary
                text="Change provider"
                onClick={() => {
                  setProvidersListLength(initialProviderDisplayCount);
                  setShowProvidersList(true);
                }}
                uswds
              />
            </div>
            <div className="vads-u-margin-top--1">
              <va-button
                secondary
                text="Remove"
                onClick={() => setShowRemoveProviderModal(true)}
                uswds
              />
            </div>
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
