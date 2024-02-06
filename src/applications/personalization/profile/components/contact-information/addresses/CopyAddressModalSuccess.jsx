import React from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import AddressView from '@@vap-svc/components/AddressField/AddressView';

const CopyAddressModalSuccess = ({ address, visible = false, onClose }) => (
  <VaModal
    modalTitle="We've updated your mailing address"
    visible={visible}
    onCloseEvent={onClose}
    onPrimaryButtonClick={onClose}
    primaryButtonText="Close"
    data-testid="copy-address-success"
    uswds
  >
    <div data-testid="modal-content">
      <p>We’ve updated your mailing address to match your home address.</p>
      <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
        <AddressView data={address} />
      </span>
    </div>
  </VaModal>
);

CopyAddressModalSuccess.propTypes = {
  address: PropTypes.object,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default CopyAddressModalSuccess;
