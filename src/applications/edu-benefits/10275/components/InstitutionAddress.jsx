import React from 'react';
import { useSelector } from 'react-redux';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

const InstitutionAddress = ({ uiSchema }) => {
  const formData = useSelector(state => state.form?.data);

  const options = uiSchema?.['ui:options'] || {};
  const { isArrayItem = false } = options;

  const index = isArrayItem ? getArrayIndexFromPathName() : null;

  const details = isArrayItem
    ? formData?.additionalLocations?.[index] || {}
    : formData?.institutionDetails || {};

  const institutionAddress = details?.institutionAddress || {};
  const {
    street,
    street2,
    street3,
    city,
    state,
    postalCode,
    country,
  } = institutionAddress;
  const hasAddress = [
    street,
    street2,
    street3,
    city,
    state,
    postalCode,
    country,
  ].some(Boolean);

  return (
    <div aria-live="polite">
      {hasAddress ? (
        <>
          <p className="va-address-block" id="institutionAddress">
            {street}
            {street2 && (
              <>
                <br />
                {street2}
              </>
            )}
            {street3 && (
              <>
                <br />
                {street3}
              </>
            )}
            <br />
            {city}, {state} {postalCode}
            <br />
            {country}
          </p>

          <va-additional-info trigger="What to do if this name or address looks incorrect">
            <p>
              After you have verified the facility code is correctly entered, if
              either the facility name or address is incorrect, please contact
              your State Approving Agency (SAA) to have your approval
              updated.&nbsp;
              <a
                href="https://nasaa-vetseducation.com/nasaa-contacts/"
                target="_blank"
                rel="noreferrer"
              >
                Go here to find your SAA’s email address (opens in new tab).
              </a>
            </p>
          </va-additional-info>
        </>
      ) : (
        <span
          aria-hidden="true"
          className="vads-u-font-weight--normal vads-u-font-size--h4 vads-u-margin-top--0p5"
        >
          --
        </span>
      )}
    </div>
  );
};

export default InstitutionAddress;
