import React from 'react';
import PropTypes from 'prop-types';
import constants from 'vets-json-schema/dist/constants.json';

export const AddressWithAutofillReviewField = ({
  canAutofillAddress,
  formData,
  inputLabel,
}) => {
  const stateLabel = constants.states.USA.find(
    state => state.value === formData.state,
  ).label;

  return (
    <>
      {canAutofillAddress &&
        formData['view:autofill'] && (
          <div className="review-row">
            <dt>Use the same address as the Veteran</dt>
            <dd>Selected</dd>
          </div>
        )}
      <div className="review-row">
        <dt>{inputLabel} current street address</dt>
        <dd>{formData.street}</dd>
      </div>
      <div className="review-row">
        <dt>Street address line 2</dt>
        <dd>{formData.street2}</dd>
      </div>
      <div className="review-row">
        <dt>City</dt>
        <dd>{formData.city}</dd>
      </div>
      <div className="review-row">
        <dt>State</dt>
        <dd>{stateLabel}</dd>
      </div>
      <div className="review-row">
        <dt>Postal code</dt>
        <dd>{formData.postalCode}</dd>
      </div>
    </>
  );
};

AddressWithAutofillReviewField.propTypes = {
  canAutofillAddress: PropTypes.bool,
  formData: PropTypes.object,
  inputLabel: PropTypes.string,
};
