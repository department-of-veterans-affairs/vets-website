import React from 'react';
import PropTypes from 'prop-types';
import { states } from 'platform/forms/address';

export const AddressWithAutofillReviewField = ({ formData, inputLabel }) => {
  const { street, street2, city, state, postalCode, county } = formData;
  const stateLabel = states.USA.find(s => s.value === state)?.label;

  return (
    <>
      {formData['view:autofill'] && (
        <div className="review-row" data-testid="cg-address-autofill">
          <dt>Use the same address as the Veteran</dt>
          <dd>Yes</dd>
        </div>
      )}
      <div className="review-row">
        <dt>{inputLabel} street address</dt>
        <dd data-testid="cg-address-street">{street}</dd>
      </div>
      <div className="review-row">
        <dt>Street address line 2</dt>
        <dd data-testid="cg-address-street2">{street2}</dd>
      </div>
      <div className="review-row">
        <dt>City</dt>
        <dd data-testid="cg-address-city">{city}</dd>
      </div>
      <div className="review-row">
        <dt>State</dt>
        <dd data-testid="cg-address-state">{stateLabel}</dd>
      </div>
      <div className="review-row">
        <dt>Postal code</dt>
        <dd data-testid="cg-address-postalcode">{postalCode}</dd>
      </div>
      <div className="review-row">
        <dt>County</dt>
        <dd data-testid="cg-address-county">{county}</dd>
      </div>
    </>
  );
};

AddressWithAutofillReviewField.propTypes = {
  formData: PropTypes.object,
  inputLabel: PropTypes.string,
};
