import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import { addressUI } from 'platform/forms-system/src/js/web-component-patterns';

import {
  setAddressValidationModalOpen,
  acceptValidatedAddress,
  setAddressValidated,
  validateAddress,
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
    validateAddress: validateAddressAction,
  } = props;

  const {
    modalOpen,
    suggestedAddresses = [],
    isValidating,
  } = addressValidation;

  // Perform address validation when modal opens
  useEffect(
    () => {
      const validateAddressData = async () => {
        const addressData =
          formData[formFields.viewMailingAddress]?.[formFields.address];

        // Skip validation for military addresses and non-US addresses
        const livesOnMilitaryBase =
          formData[formFields.viewMailingAddress]?.[
            formFields.livesOnMilitaryBase
          ];

        if (livesOnMilitaryBase || addressData?.country !== 'USA') {
          // Auto-validate non-US and military addresses
          const newFormData = {
            ...formData,
            [formFields.viewMailingAddress]: {
              ...formData[formFields.viewMailingAddress],
              addressValidated: true,
            },
          };
          setFormData(newFormData);
          setModalOpen(false);
          return;
        }

        try {
          await validateAddressAction(addressData);
        } catch (error) {
          // Log error but don't block submission
          const logger = window.console;
          if (logger && logger.error) {
            logger.error('Address validation error:', error);
          }
        }
      };

      if (modalOpen) {
        validateAddressData();
      }
    },
    [modalOpen, formData, setFormData, setModalOpen, validateAddressAction],
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

  const handleAddressChange = newAddress => {
    const updatedFormData = {
      ...formData,
      [formFields.viewMailingAddress]: {
        ...formData[formFields.viewMailingAddress],
        [formFields.address]: {
          ...formData[formFields.viewMailingAddress]?.[formFields.address],
          ...newAddress,
        },
        addressValidated: false,
      },
    };
    setFormData(updatedFormData);
  };

  const addressPattern = addressUI({
    required: {
      street: true,
      city: true,
      state: address => address.country === 'USA',
      postalCode: address => address.country === 'USA',
    },
  });

  return (
    <div>
      <VaModal
        modalTitle="Please review your mailing address"
        visible={modalOpen}
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
        {isValidating ? (
          <va-loading-indicator
            message="Validating your address..."
            setFocus
            data-testid="address-validation-loading"
          />
        ) : (
          <>
            <p>
              We've compared your address with the U.S. Postal Service's
              database. Please choose which address you'd like to use:
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

            <div className="vads-u-margin-top--4">
              <h4>Enter a different address</h4>
              <div {...addressPattern}>
                <va-text-input
                  name="street"
                  label="Street"
                  value={userEnteredAddress?.street || ''}
                  onInput={e => handleAddressChange({ street: e.target.value })}
                  required
                />
                <va-text-input
                  name="street2"
                  label="Street line 2"
                  value={userEnteredAddress?.street2 || ''}
                  onInput={e =>
                    handleAddressChange({ street2: e.target.value })
                  }
                />
                <va-text-input
                  name="city"
                  label="City"
                  value={userEnteredAddress?.city || ''}
                  onInput={e => handleAddressChange({ city: e.target.value })}
                  required
                />
                <va-select
                  name="state"
                  label="State"
                  value={userEnteredAddress?.state || ''}
                  required={userEnteredAddress?.country === 'USA'}
                  onVaSelect={e =>
                    handleAddressChange({ state: e.detail.value })
                  }
                  options={addressPattern.stateOptions || []}
                />
                <va-text-input
                  name="postalCode"
                  label={
                    userEnteredAddress?.country === 'USA'
                      ? 'ZIP code'
                      : 'Postal code'
                  }
                  value={userEnteredAddress?.postalCode || ''}
                  onInput={e =>
                    handleAddressChange({ postalCode: e.target.value })
                  }
                  required={userEnteredAddress?.country === 'USA'}
                />
              </div>
            </div>
          </>
        )}
      </VaModal>
    </div>
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
  validateAddress: PropTypes.func,
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
  validateAddress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationModal);
