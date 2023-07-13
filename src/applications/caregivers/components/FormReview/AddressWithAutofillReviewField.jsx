import React from 'react';
import PropTypes from 'prop-types';
import constants from 'vets-json-schema/dist/constants.json';

export const AddressWithAutofillReviewField = ({ formData, inputLabel }) => {
  const stateLabel = constants.states.USA.find(
    state => state.value === formData.state,
  ).label;

  return (
    <>
      {formData['view:autofill'] && (
        <div className="review-row" data-testid="cg-address-autofill">
          <dt>Use the same address as the Veteran</dt>
          <dd>Selected</dd>
        </div>
      )}
      <div className="review-row">
        <dt>{inputLabel} current street address</dt>
        <dd data-testid="cg-address-street">{formData.street}</dd>
      </div>
      <div className="review-row">
        <dt>Street address line 2</dt>
        <dd data-testid="cg-address-street2">{formData.street2}</dd>
      </div>
      <div className="review-row">
        <dt>City</dt>
        <dd data-testid="cg-address-city">{formData.city}</dd>
      </div>
      <div className="review-row">
        <dt>State</dt>
        <dd data-testid="cg-address-state">{stateLabel}</dd>
      </div>
      <div className="review-row">
        <dt>Postal code</dt>
        <dd data-testid="cg-address-postalcode">{formData.postalCode}</dd>
      </div>
    </>
  );
};

AddressWithAutofillReviewField.propTypes = {
  formData: PropTypes.object,
  inputLabel: PropTypes.string,
};
