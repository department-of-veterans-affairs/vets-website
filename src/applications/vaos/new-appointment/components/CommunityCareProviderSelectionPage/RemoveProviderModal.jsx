import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { distanceBetween } from '../../../utils/address';

export default function RemoveProviderModal({ onClose, provider, address }) {
  const title = 'Are you sure you want to remove this provider?';
  const content = (
    <>
      <span className="vads-u-display--block vads-u-font-weight--bold">
        {provider.name}
      </span>
      <span className="vads-u-display--block">{provider.address?.line}</span>
      <span className="vads-u-display--block">
        {provider.address?.city}, {provider.address?.state}{' '}
        {provider.address?.postalCode}
      </span>
      <span className="vads-u-display--block vads-u-font-size--sm vads-u-font-weight--bold vads-u-margin-bottom--2">
        {distanceBetween(
          provider.position?.latitude,
          provider.position?.longitude,
          address.latitude,
          address.longitude,
        )}{' '}
        miles
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
    <Modal id="removeProviderModal" visible onClose={onClose} title={title}>
      {content}
    </Modal>
  );
}
