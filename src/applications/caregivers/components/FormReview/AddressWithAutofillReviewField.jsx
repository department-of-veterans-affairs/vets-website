import React from 'react';
import PropTypes from 'prop-types';
import { states } from 'platform/forms/address';
import { replaceStrValues } from '../../utils/helpers';
import content from '../../locales/en/content.json';

export const AddressWithAutofillReviewField = ({ formData, inputLabel }) => {
  const { street, street2, city, state, postalCode, county } = formData;
  const stateLabel = states.USA.find(s => s.value === state)?.label;
  const streetAddressLabel = replaceStrValues(
    content['form-address-street-label'],
    inputLabel,
  );

  return (
    <>
      {formData['view:autofill'] && (
        <div className="review-row" data-testid="cg-address-autofill">
          <dt>{content['caregiver-address-same-as-vet-label']}</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="data value">
            Yes
          </dd>
        </div>
      )}
      <div className="review-row">
        <dt>{streetAddressLabel}</dt>
        <dd
          className="dd-privacy-hidden"
          data-dd-action-name="data value"
          data-testid="cg-address-street"
        >
          {street}
        </dd>
      </div>
      <div className="review-row">
        <dt>{content['form-address-street2-label']}</dt>
        <dd
          className="dd-privacy-hidden"
          data-dd-action-name="data value"
          data-testid="cg-address-street2"
        >
          {street2}
        </dd>
      </div>
      <div className="review-row">
        <dt>{content['form-address-city-label']}</dt>
        <dd
          className="dd-privacy-hidden"
          data-dd-action-name="data value"
          data-testid="cg-address-city"
        >
          {city}
        </dd>
      </div>
      <div className="review-row">
        <dt>{content['form-address-state-label']}</dt>
        <dd
          className="dd-privacy-hidden"
          data-dd-action-name="data value"
          data-testid="cg-address-state"
        >
          {stateLabel}
        </dd>
      </div>
      <div className="review-row">
        <dt>{content['form-address-postalCode-label']}</dt>
        <dd
          className="dd-privacy-hidden"
          data-dd-action-name="data value"
          data-testid="cg-address-postalcode"
        >
          {postalCode}
        </dd>
      </div>
      <div className="review-row">
        <dt>{content['form-address-county-label']}</dt>
        <dd
          className="dd-privacy-hidden"
          data-dd-action-name="data value"
          data-testid="cg-address-county"
        >
          {county}
        </dd>
      </div>
    </>
  );
};

AddressWithAutofillReviewField.propTypes = {
  formData: PropTypes.object,
  inputLabel: PropTypes.string,
};
