import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';

import {
  toggleModal as toggleModalAction,
  acceptValidatedAddress,
  setAddressValidated,
  resetAddressValidation,
} from '../actions';
import { formFields } from '../constants';

function AddressValidationModal(props) {
  const {
    addressValidation,
    formData,
    setFormData,
    resetAddressValidation: resetValidation,
    setAddressValidated: setValidated,
    toggleModal,
    acceptValidatedAddress: acceptAddress,
  } = props;

  const { modalOpen, suggestedAddresses = [], validated } = addressValidation;

  const userEnteredAddress =
    formData?.[formFields.viewMailingAddress]?.[formFields.address];

  // Track which address is selected in the modal (user entered or suggested)
  const [selectedAddress, setSelectedAddress] = React.useState('userEntered');

  // Control modal visibility based on validation state
  useEffect(
    () => {
      if (suggestedAddresses?.length > 0 && !validated) {
        toggleModal(true);
      } else {
        toggleModal(false);
      }
    },
    [suggestedAddresses, validated, toggleModal],
  );

  // Reset selected address when modal opens/closes
  useEffect(
    () => {
      if (modalOpen) {
        setSelectedAddress('userEntered');
      }
    },
    [modalOpen],
  );

  // Reset validation when component unmounts
  useEffect(
    () => {
      return () => {
        resetValidation();
      };
    },
    [resetValidation],
  );

  // Handle user clicking "Use this address" button
  const handleAcceptAddress = () => {
    let addressToUse;

    if (selectedAddress === 'userEntered') {
      // User wants to keep their original address
      addressToUse = userEnteredAddress;
    } else {
      // User selected a suggested address
      const selectedSuggestion = suggestedAddresses.find(
        (_, index) => `suggested-${index}` === selectedAddress,
      );
      addressToUse = selectedSuggestion;
    }

    // Update address in Redux
    acceptAddress(addressToUse);

    // Mark as validated
    setValidated(true);

    // Update form data directly
    if (setFormData && formData) {
      const updatedFormData = {
        ...formData,
        [formFields.viewMailingAddress]: {
          ...formData[formFields.viewMailingAddress],
          [formFields.address]: addressToUse,
        },
      };
      setFormData(updatedFormData);
    }

    // Close modal
    toggleModal(false);
  };

  // Format address for display
  const formatAddress = address => {
    if (!address) return '';

    const { street, street2, city, state, postalCode } = address;
    let formattedAddress = street || '';

    if (street2) {
      formattedAddress += ` ${street2}`;
    }

    if (city || state || postalCode) {
      formattedAddress += `, ${city || ''}, ${state || ''} ${postalCode || ''}`;
    }

    return formattedAddress;
  };

  return (
    <Modal
      id="address-validation-modal"
      status="info"
      visible={modalOpen}
      onClose={() => toggleModal(false)}
      title="Please review your mailing address"
      primaryButton={{
        text: 'Use this address',
        onClick: handleAcceptAddress,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: () => toggleModal(false),
      }}
    >
      <p>
        We've compared your address with the U.S. Postal Service's database.
        Please choose an address to use from the options below.
      </p>

      <div className="vads-u-margin-top--2">
        <VaRadio
          label="Address I entered"
          name="addressSelection"
          checked={selectedAddress === 'userEntered'}
          onValueChange={() => setSelectedAddress('userEntered')}
          description={formatAddress(userEnteredAddress)}
        />
      </div>

      {suggestedAddresses.map((address, index) => (
        <div className="vads-u-margin-top--2" key={`suggested-${index}`}>
          <VaRadio
            label={`Suggested address ${index + 1}`}
            name="addressSelection"
            checked={selectedAddress === `suggested-${index}`}
            onValueChange={() => setSelectedAddress(`suggested-${index}`)}
            description={formatAddress(address)}
          />
        </div>
      ))}

      <div className="vads-u-margin-top--3">
        <p>
          If none of these options are correct, you can close this window and
          update your address in the form.
        </p>
      </div>
    </Modal>
  );
}

AddressValidationModal.propTypes = {
  addressValidation: PropTypes.object,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  acceptValidatedAddress: PropTypes.func,
  toggleModal: PropTypes.func,
  setAddressValidated: PropTypes.func,
  resetAddressValidation: PropTypes.func,
};

const mapStateToProps = state => ({
  addressValidation: state.data.addressValidation,
  formData: state.form.data,
});

const mapDispatchToProps = {
  setFormData: setData,
  acceptValidatedAddress,
  toggleModal: toggleModalAction,
  setAddressValidated,
  resetAddressValidation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationModal);
