import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

export default function RemoveProviderModal({ onClose, provider }) {
  const title = 'Remove this provider?';
  const content = (
    <>
      <p>
        We’ll remove {provider.name} as your preferred provider for this
        appointment request.
      </p>
      <button type="button" onClick={() => onClose(true)}>
        Remove provider
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
