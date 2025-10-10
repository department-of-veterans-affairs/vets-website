import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import { addressUI } from 'platform/forms-system/src/js/web-component-patterns';
import constants from 'vets-json-schema/dist/constants.json';

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

  const userEnteredAddress =
    formData[formFields.viewMailingAddress]?.[formFields.address];

  const stateOptions = constants.states.USA.map(state => ({
    value: state.value,
    label: state.label,
  }));

  const selectRef = useRef();

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

  useEffect(
    () => {
      const selectEl = selectRef.current;
      if (!selectEl) return;

      const handleVaSelect = e => {
        handleAddressChange({ state: e.detail.value });
      };

      selectEl.addEventListener('vaSelect', handleVaSelect);

      /* eslint-disable-next-line consistent-return */
      return () => {
        selectEl.removeEventListener('vaSelect', handleVaSelect);
      };
    },
    [handleAddressChange],
  );

  const isAddressComplete = address => {
    if (!address) return false;
    const { street, city, state, postalCode, country = 'USA' } = address;

    if (country === 'USA') {
      return Boolean(street && city && state && postalCode);
    }
    return Boolean(street && city);
  };

  const validateAddressData = async () => {
    const addressData =
      formData[formFields.viewMailingAddress]?.[formFields.address];

    const livesOnMilitaryBase =
      formData[formFields.viewMailingAddress]?.[formFields.livesOnMilitaryBase];

    if (livesOnMilitaryBase || addressData?.country !== 'USA') {
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
      // Format address data using camelCase
      const formattedAddress = {
        addressLine1: addressData.street,
        addressLine2: addressData.street2 || '',
        addressLine3: addressData.street3 || '',
        city: addressData.city,
        stateCode: addressData.state,
        countryCode: addressData.country,
        zipCode: addressData.postalCode,
      };

      await validateAddressAction(formattedAddress);
    } catch (error) {
      const logger = window.console;
      if (logger && logger.error) {
        logger.error('Address validation error:', error);
      }
    }
  };

  const handleAcceptAddress = selectedAddress => {
    const updatedFormData = {
      ...formData,
      [formFields.viewMailingAddress]: {
        ...formData[formFields.viewMailingAddress],
        [formFields.address]: selectedAddress,
        addressValidated: true,
      },
    };
    setFormData(updatedFormData);

    acceptAddress(selectedAddress);
    setValidated(true);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

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

  const addressPattern = addressUI({
    required: {
      street: true,
      city: true,
      state: address => address.country === 'USA',
      postalCode: address => address.country === 'USA',
    },
  });

  const renderAddressForm = () => (
    <div>
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
          onInput={e => handleAddressChange({ street2: e.target.value })}
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
          ref={selectRef}
        >
          {stateOptions.map(state => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </va-select>
        <va-text-input
          name="postalCode"
          label={
            userEnteredAddress?.country === 'USA' ? 'ZIP code' : 'Postal code'
          }
          value={userEnteredAddress?.postalCode || ''}
          onInput={e => handleAddressChange({ postalCode: e.target.value })}
          required={userEnteredAddress?.country === 'USA'}
        />
      </div>
      <div className="vads-u-margin-top--2">
        <va-button
          onClick={validateAddressData}
          text="Validate Address"
          disabled={!isAddressComplete(userEnteredAddress)}
        />
      </div>
    </div>
  );

  const renderValidationResults = () => (
    <>
      <p>
        We’ve compared your address with the U.S. Postal Service’s database.
        Please choose which address you’d like to use:
      </p>

      <div className="vads-u-margin-y--2">
        <strong>Address as entered:</strong>
        <p className="vads-u-margin-top--0">
          {formatAddress(userEnteredAddress)}
        </p>
        <va-button
          onClick={() => handleAcceptAddress(userEnteredAddress)}
          text="Use address as entered"
          class="vads-u-margin-top--1"
        />
      </div>

      <div className="vads-u-margin-y--2">
        <strong>Suggested address:</strong>
        <p className="vads-u-margin-top--0">
          {formatAddress(suggestedAddresses[0])}
        </p>
        <va-button
          onClick={() => handleAcceptAddress(suggestedAddresses[0])}
          text="Use suggested address"
          class="vads-u-margin-top--1"
        />
      </div>
    </>
  );

  const renderModalContent = () => {
    if (isValidating) {
      return (
        <va-loading-indicator
          message="Validating your address..."
          setFocus
          data-testid="address-validation-loading"
        />
      );
    }

    if (suggestedAddresses.length > 0) {
      return renderValidationResults();
    }

    return renderAddressForm();
  };

  return (
    <div>
      <VaModal
        modalTitle="Enter your mailing address"
        visible={modalOpen}
        onCloseEvent={handleCancel}
        primaryButtonText="Cancel"
        status="info"
      >
        {renderModalContent()}
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
