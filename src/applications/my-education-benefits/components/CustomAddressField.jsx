import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addressUI } from 'platform/forms-system/src/js/web-component-patterns';
import { setData } from 'platform/forms-system/src/js/actions';
import { setAddressValidationModalOpen } from '../actions';
import { formFields } from '../constants';

export function CustomAddressField({
  formData,
  onChange,
  onBlur,
  setFormData,
  setModalOpen,
  stateOptions,
}) {
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

  const handleBlur = () => {
    // Open the validation modal when the user is done entering the address
    setModalOpen(true);
    if (onBlur) {
      onBlur();
    }
  };

  const addressPattern = addressUI();
  return (
    <div {...addressPattern}>
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
        onBlur={handleBlur}
      />
    </div>
  );
}

CustomAddressField.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  setFormData: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  stateOptions: PropTypes.array,
};

const mapStateToProps = state => ({
  formData: state.form.data,
});

const mapDispatchToProps = {
  setFormData: setData,
  setModalOpen: setAddressValidationModalOpen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomAddressField);
