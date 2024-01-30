import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

export default function RemoveProviderModal({ onClose, provider }) {
  const title = 'Are you sure you want to remove this provider?';
  const content = (
    <>
      <span className="vads-u-display--block vads-u-font-weight--bold">
        {provider.name}
      </span>
      <span className="vads-u-display--block">{provider.address?.line}</span>
      <span className="vads-u-display--block vads-u-margin-bottom--1">
        {provider.address?.city}, {provider.address?.state}{' '}
        {provider.address?.postalCode}
      </span>
      <button type="button" onClick={() => onClose(true)}>
        Yes, remove provider
      </button>
      <button
        className="usa-button-secondary"
        type="button"
        onClick={() => onClose(false)}
        aria-label="Cancel removing the selected provider"
      >
        Cancel
      </button>
    </>
  );

  return (
    <VaModal
      id="removeProviderModal"
      visible
      onCloseEvent={onClose}
      modalTitle={title}
      data-testid="removeProviderModal"
      status="warning"
      uswds
    >
      {content}
    </VaModal>
  );
}
RemoveProviderModal.propTypes = {
  provider: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
