import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { states } from 'platform/forms/address';
import { replaceStrValues } from '../../utils/helpers';
import content from '../../locales/en/content.json';

export const AddressWithAutofillReviewField = ({ formData, inputLabel }) => {
  const addressRows = useMemo(
    () =>
      ['street', 'street2', 'city', 'state', 'postalCode', 'county'].map(
        field => {
          const label =
            field === 'street'
              ? replaceStrValues(
                  content[`form-address-street-label`],
                  inputLabel,
                )
              : content[`form-address-${field}-label`];
          const value =
            field === 'state'
              ? states.USA.find(s => s.value === formData.state)?.label
              : formData[field];
          return (
            <div key={field} className="review-row">
              <dt>{label}</dt>
              <dd
                className="dd-privacy-hidden"
                data-dd-action-name="data value"
                data-testid={`cg-address-${field}`}
              >
                {value}
              </dd>
            </div>
          );
        },
      ),
    [formData, inputLabel],
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
      {addressRows}
    </>
  );
};

AddressWithAutofillReviewField.propTypes = {
  formData: PropTypes.object,
  inputLabel: PropTypes.string,
};

export default AddressWithAutofillReviewField;
