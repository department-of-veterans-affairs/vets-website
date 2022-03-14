import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import AddressView from '@@vap-svc/components/AddressField/AddressView';

const CopyAddressModal = props => {
  const {
    isVisible,
    onClose,
    onYes,
    onNo,
    mainAddress,
    addressToUpdate,
  } = props;

  const [updateStatus, setUpdateStatus] = useState();

  const CopyAddressMainModal = () => (
    <Modal
      title="We've updated your home address"
      visible={isVisible}
      onClose={onClose}
      primaryButton={{
        action: () => {
          setUpdateStatus('success');
        },
        text: 'Yes',
      }}
      secondaryButton={{
        action: () => {
          onNo();
        },
        text: 'No',
      }}
      id="copy-address-modal"
    >
      <>
        <p data-testid="modal-content">
          Your updated home address:
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={mainAddress} />
          </span>
        </p>
        <va-featured-content>
          We have this mailing address on file for you:
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={addressToUpdate} />
          </span>
          Do you want to update your mailing address to match this home address?
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={mainAddress} />
          </span>
        </va-featured-content>
        <button type="button" onClick={() => setUpdateStatus('failure')}>
          Trigger Mailing Address Failure
        </button>
      </>
    </Modal>
  );

  const UpdateErrorModal = () => (
    <Modal
      title="We can't update your mailing address"
      visible={updateStatus === 'failure'}
      onClose={onClose}
      status="error"
      primaryButton={{
        action: () => {
          setUpdateStatus(null);
          onYes();
        },
        text: 'Close',
      }}
    >
      <>
        <p data-testid="modal-content">
          We’re sorry. We can’t update your information right now. We’re working
          to fix this problem. Please check back later.
        </p>
      </>
    </Modal>
  );

  const UpdateSuccessModal = () => (
    <Modal
      title="We've updated your mailing address"
      visible={updateStatus === 'success'}
      onClose={onClose}
      primaryButton={{
        action: () => {
          setUpdateStatus(null);
          onYes();
        },
        text: 'Close',
      }}
    >
      <>
        <p data-testid="modal-content">
          We’ve updated your mailing address to match your home address.
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={mainAddress} />
          </span>
        </p>
      </>
    </Modal>
  );

  return (
    <>
      {isVisible && !updateStatus && <CopyAddressMainModal />}
      {isVisible && updateStatus === 'failure' && <UpdateErrorModal />}
      {isVisible && updateStatus === 'success' && <UpdateSuccessModal />}
    </>
  );
};

CopyAddressModal.propTypes = {
  addressToUpdate: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  mainAddress: PropTypes.object.isRequired,
  onNo: PropTypes.func.isRequired,
  onYes: PropTypes.func.isRequired,
};

export default CopyAddressModal;
