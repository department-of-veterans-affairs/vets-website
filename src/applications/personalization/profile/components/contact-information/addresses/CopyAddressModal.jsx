import React from 'react';
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

  return (
    <Modal
      title="We've updated your home address"
      visible={isVisible}
      onClose={onClose}
      primaryButton={{
        action: () => {
          // console.log('YES!');
          onYes();
        },
        text: 'Yes',
      }}
      secondaryButton={{
        action: () => {
          // console.log('NO!');
          onNo();
        },
        text: 'No',
      }}
    >
      <>
        <p data-testid="modal-content">
          Your updated home address:
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={mainAddress} />
          </span>
        </p>
        <p className="vads-u-background-color--primary-alt-lightest vads-u-padding--1p5">
          We also have this mailing address on file for you:
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={addressToUpdate} />
          </span>
          Do you want to update your mailing address to match this home address?
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={mainAddress} />
          </span>
        </p>
      </>
    </Modal>
  );
};

CopyAddressModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onYes: PropTypes.func.isRequired,
  onNo: PropTypes.func.isRequired,
};

export default CopyAddressModal;
