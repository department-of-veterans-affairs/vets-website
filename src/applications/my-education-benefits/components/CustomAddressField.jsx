import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addressUI } from 'platform/forms-system/src/js/web-component-patterns';
import { setData } from 'platform/forms-system/src/js/actions';
import { validateAddress as validateAddressAction } from '../actions';
import { formFields } from '../constants';

export function CustomAddressField({
  formData,
  onChange,
  onBlur,
  validateAddress,
  setFormData,
  stateOptions,
}) {
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateAddress = async addressData => {
    // Skip validation for military addresses and non-US addresses
    const livesOnMilitaryBase =
      formData[formFields.viewMailingAddress]?.[formFields.livesOnMilitaryBase];

    if (livesOnMilitaryBase || addressData.country !== 'USA') {
      // Auto-validate non-US and military addresses
      const newFormData = {
        ...formData,
        [formFields.viewMailingAddress]: {
          ...formData[formFields.viewMailingAddress],
          addressValidated: true,
        },
      };
      setFormData(newFormData);
      return;
    }

    setIsValidating(true);
    try {
      const response = await validateAddress(addressData);

      if (response?.addresses?.length > 0) {
        const { confidenceScore } = response.addresses[0].addressMetaData;

        if (confidenceScore >= 100) {
          // Auto-validate for high confidence matches
          const newFormData = {
            ...formData,
            [formFields.viewMailingAddress]: {
              ...formData[formFields.viewMailingAddress],
              addressValidated: true,
            },
          };
          setFormData(newFormData);
        } else {
          // Show modal for low confidence matches through Redux
          // The modal component will handle updating addressValidated when user selects an address
          const newFormData = {
            ...formData,
            [formFields.viewMailingAddress]: {
              ...formData[formFields.viewMailingAddress],
              addressValidated: false,
            },
          };
          setFormData(newFormData);
        }
      }
    } catch (error) {
      // Log error but don't block submission
      const logger = window.console;
      if (logger && logger.error) {
        logger.error('Address validation error:', error);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = field => {
    // Reset validation when address changes
    const newFormData = {
      ...formData,
      [formFields.viewMailingAddress]: {
        ...formData[formFields.viewMailingAddress],
        addressValidated: false,
      },
    };
    setFormData(newFormData);
    onChange(field);
  };

  const addressPattern = addressUI();
  return (
    <div {...addressPattern}>
      {isValidating && (
        <div className="vads-u-margin-bottom--2">
          <va-loading-indicator
            message="Validating your address..."
            setFocus
            data-testid="address-validation-loading"
          />
        </div>
      )}
      <va-text-input
        name="street"
        label="Street"
        value={formData?.street || ''}
        onInput={e => handleChange({ ...formData, street: e.target.value })}
        required
      />
      <va-text-input
        name="street2"
        label="Street line 2"
        value={formData?.street2 || ''}
        onInput={e => handleChange({ ...formData, street2: e.target.value })}
      />
      {formData?.street3 && (
        <va-text-input
          name="street3"
          label="Street line 3"
          value={formData?.street3 || ''}
          onInput={e => handleChange({ ...formData, street3: e.target.value })}
        />
      )}
      <va-text-input
        name="city"
        label="City"
        value={formData?.city || ''}
        onInput={e => handleChange({ ...formData, city: e.target.value })}
        required
      />
      <va-select
        name="state"
        label="State"
        value={formData?.state || ''}
        required={formData?.country === 'USA'}
        onVaSelect={e => handleChange({ ...formData, state: e.detail.value })}
        options={stateOptions || []}
      />
      <va-text-input
        name="postalCode"
        label={formData?.country === 'USA' ? 'ZIP code' : 'Postal code'}
        value={formData?.postalCode || ''}
        onInput={e => handleChange({ ...formData, postalCode: e.target.value })}
        required
        onBlur={async () => {
          if (formData && !isValidating) {
            await handleValidateAddress(formData);
          }
          if (onBlur) {
            onBlur();
          }
        }}
      />
    </div>
  );
}

CustomAddressField.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  validateAddress: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  stateOptions: PropTypes.array,
};

const mapStateToProps = state => ({
  formData: state.form.data,
});

const mapDispatchToProps = {
  validateAddress: validateAddressAction,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomAddressField);
