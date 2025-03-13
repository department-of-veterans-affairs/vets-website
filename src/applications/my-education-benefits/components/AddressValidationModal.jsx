import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatAddress } from 'platform/forms/address/helpers';

const AddressValidationModal = ({
  isOpen,
  onClose,
  userEnteredAddress,
  suggestedAddresses,
  onAcceptAddress,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState('0'); // Default to first suggested address

  const handleSubmit = event => {
    event.preventDefault();
    // Get the selected address (either user-entered or a suggested one)
    const addressToUse =
      selectedAddressId === 'userEntered'
        ? userEnteredAddress
        : suggestedAddresses[parseInt(selectedAddressId, 10)]?.address;

    onAcceptAddress(addressToUse);
    onClose();
  };

  const renderAddressOption = (address, id) => {
    const { street, cityStateZip, country } = formatAddress(address);

    return (
      <div key={id} className="vads-u-margin-bottom--1p5">
        <input
          type="radio"
          id={id}
          name="selectedAddress"
          onChange={() => setSelectedAddressId(id)}
          checked={selectedAddressId === id}
        />
        <label
          htmlFor={id}
          className="vads-u-margin-top--2 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-left--2"
        >
          <span>{street}</span>
          <span>{cityStateZip}</span>
          <span>{country}</span>
        </label>
      </div>
    );
  };

  return (
    <VaModal
      modalTitle="Verify your address"
      onCloseEvent={onClose}
      visible={isOpen}
      uswds
    >
      <VaAlert
        status="warning"
        headline="We can't confirm the address you entered with the U.S. Postal Service"
        uswds
      >
        <p>
          We can use the suggested address we found. Or, you can continue with
          the address you entered or edit it.
        </p>
      </VaAlert>

      <form onSubmit={handleSubmit}>
        <h3 className="vads-u-font-weight--bold vads-u-margin-top--2">
          You entered:
        </h3>
        {renderAddressOption(userEnteredAddress, 'userEntered')}

        <h3 className="vads-u-font-weight--bold vads-u-margin-top--2">
          Suggested address:
        </h3>
        {suggestedAddresses.map((addressData, index) =>
          renderAddressOption(addressData.address, String(index)),
        )}

        <div className="vads-u-margin-top--4">
          <button type="submit" className="usa-button">
            Use selected address
          </button>
          <button
            type="button"
            className="usa-button usa-button-secondary"
            onClick={onClose}
          >
            Edit address
          </button>
        </div>
      </form>
    </VaModal>
  );
};

AddressValidationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userEnteredAddress: PropTypes.object.isRequired,
  suggestedAddresses: PropTypes.array.isRequired,
  onAcceptAddress: PropTypes.func.isRequired,
};

export default AddressValidationModal;
