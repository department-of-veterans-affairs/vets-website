import React from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addressUI } from 'platform/forms-system/src/js/definitions/address';
import { LoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { validateAddress } from '../actions';
import { formFields } from '../constants';

function CustomAddressField(props) {
  function handleChange(address) {
    // Update form data with new address
    props.setFormData({
      ...props.formData,
      [formFields.viewMailingAddress]: {
        ...props.formData[formFields.viewMailingAddress],
        [formFields.address]: address,
        // Reset validation when address changes
        addressValidated: false,
      },
    });

    // Only validate US non-military addresses with complete info
    const shouldValidate =
      address.country === 'USA' &&
      !props.formData[formFields.viewMailingAddress]?.[
        formFields.livesOnMilitaryBase
      ] &&
      address.street &&
      address.city &&
      address.state &&
      address.postalCode;

    if (shouldValidate) {
      props.validateAddress(address);
    }
  }

  return (
    <div>
      {props.isValidating && (
        <div className="vads-u-margin-bottom--2">
          <LoadingIndicator message="Validating address..." />
        </div>
      )}
      <div {...addressUI('', false, null, true)}>
        <input
          type="text"
          {...props}
          onChange={handleChange}
          value={props.address}
        />
      </div>
    </div>
  );
}

CustomAddressField.propTypes = {
  validateAddress: PropTypes.func,
  setFormData: PropTypes.func,
  formData: PropTypes.object,
  address: PropTypes.object,
  isValidating: PropTypes.bool,
};

const mapStateToProps = state => ({
  address: state.form.data[formFields.viewMailingAddress]?.[formFields.address],
  formData: state.form.data,
  isValidating: state.data.addressValidation.isValidating,
});

const mapDispatchToProps = {
  setFormData: setData,
  validateAddress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomAddressField);
