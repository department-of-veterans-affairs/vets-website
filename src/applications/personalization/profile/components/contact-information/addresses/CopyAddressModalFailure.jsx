import React from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CopyAddressModalFailure = ({ visible, onClose }) => (
  <VaModal
    modalTitle="We can't update your mailing address"
    visible={visible}
    onClose={onClose}
    status="error"
    primaryButtonText="Close"
    onPrimaryButtonClick={onClose}
    data-testid="copy-address-failure"
    uswds
  >
    <>
      <div data-testid="modal-content">
        <p>
          We’re sorry. We can’t update your information right now. We’re working
          to fix this problem. Try again later.
        </p>
      </div>
    </>
  </VaModal>
);

CopyAddressModalFailure.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CopyAddressModalFailure;
