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
    optionalUpdateAddressType,
    mainAddress,
    addressToUpdate,
  } = props;

  const mainAddressType =
    optionalUpdateAddressType === 'mailing'
      ? 'home'
      : optionalUpdateAddressType;

  return (
    <Modal
      title={`Do you also want to update your ${optionalUpdateAddressType} address?`}
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
          {`We’ve updated your ${mainAddressType} address to this address:`}
          <br />
          <strong>
            <AddressView data={mainAddress} />
          </strong>
        </p>
        <p>
          We send your prescriptions and letters to your mailing address. This
          is the mailing address we have on file for you:
          <br />
          <strong>
            <AddressView data={addressToUpdate} />
          </strong>
        </p>
        <p>
          Do you want to update your mailing address to match your updated home
          address?
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
