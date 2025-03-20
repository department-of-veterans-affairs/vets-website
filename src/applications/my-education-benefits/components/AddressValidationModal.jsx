import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';

import {
  setAddressValidationModalOpen,
  acceptValidatedAddress,
  setAddressValidated,
} from '../actions';
import { formFields } from '../constants';

function AddressValidationModal(props) {
  const {
    addressValidation,
    formData,
    setFormData,
    setModalOpen,
    acceptAddress,
    setValidated,
  } = props;

  const {
    // modalOpen,
    suggestedAddresses = [],
    isValidating,
  } = addressValidation;

  // Control modal visibility based on validation state and suggested addresses
  useEffect(
    () => {
      if (suggestedAddresses?.length > 0 && !isValidating) {
        setModalOpen(true);
      }
    },
    [suggestedAddresses, isValidating, setModalOpen],
  );

  const handleAcceptAddress = selectedAddress => {
    // Update address in form data
    const updatedFormData = {
      ...formData,
      [formFields.viewMailingAddress]: {
        ...formData[formFields.viewMailingAddress],
        [formFields.address]: selectedAddress,
        addressValidated: true,
      },
    };
    setFormData(updatedFormData);

    // Update Redux state
    acceptAddress(selectedAddress);
    setValidated(true);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  // Format address for display
  const formatAddress = address => {
    if (!address) return '';
    const { street, street2, city, state, postalCode } = address;
    const parts = [
      street,
      street2,
      [city, state, postalCode].filter(Boolean).join(' '),
    ].filter(Boolean);
    return parts.join(', ');
  };

  const userEnteredAddress =
    formData[formFields.viewMailingAddress]?.[formFields.address];

  return (
    <VaModal
      modalTitle="Please review your mailing address"
      visible
      onCloseEvent={handleCancel}
      onPrimaryButtonClick={() => handleAcceptAddress(userEnteredAddress)}
      onSecondaryButtonClick={() => {
        if (suggestedAddresses.length > 0) {
          handleAcceptAddress(suggestedAddresses[0]);
        }
      }}
      primaryButtonText="Use address as entered"
      secondaryButtonText={
        suggestedAddresses.length > 0 ? 'Use suggested address' : 'Cancel'
      }
      status="info"
    >
      <p>
        We've compared your address with the U.S. Postal Service's database.
        Please choose which address you'd like to use:
      </p>

      <div className="vads-u-margin-y--2">
        <strong>Address as entered:</strong>
        <p className="vads-u-margin-top--0">
          {formatAddress(userEnteredAddress)}
        </p>
      </div>

      {suggestedAddresses.length > 0 && (
        <div className="vads-u-margin-y--2">
          <strong>Suggested address:</strong>
          <p className="vads-u-margin-top--0">
            {formatAddress(suggestedAddresses[0])}
          </p>
        </div>
      )}
    </VaModal>
  );
}

AddressValidationModal.propTypes = {
  addressValidation: PropTypes.shape({
    modalOpen: PropTypes.bool,
    suggestedAddresses: PropTypes.array,
    isValidating: PropTypes.bool,
  }),
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  setModalOpen: PropTypes.func,
  acceptAddress: PropTypes.func,
  setValidated: PropTypes.func,
};

const mapStateToProps = state => ({
  addressValidation: state.data.addressValidation,
  formData: state.form.data,
});

const mapDispatchToProps = {
  setFormData: setData,
  setModalOpen: setAddressValidationModalOpen,
  acceptAddress: acceptValidatedAddress,
  setValidated: setAddressValidated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationModal);
