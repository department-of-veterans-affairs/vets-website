import React from 'react';
import { useSelector } from 'react-redux';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

const AdditionalInstitutionAddress = () => {
  const formData = useSelector(state => state.form?.data);

  const index = getArrayIndexFromPathName();

  const details = formData?.additionalInstitutionDetails?.[index] || {};
  const facilityCode = (details?.facilityCode || '').trim();

  const additionalFacilityCodes =
    formData?.additionalInstitutionDetails?.map(item =>
      item?.facilityCode?.trim(),
    ) || [];

  const facilityCodes = [
    ...additionalFacilityCodes,
    formData?.institutionDetails?.facilityCode,
  ];

  const isDuplicate =
    facilityCodes?.filter(item => item === facilityCode).length > 1;

  const institutionName = details?.institutionName;
  const institutionAddress = details?.institutionAddress || {};
  const notYR = details.yrEligible === false;
  const showWarningBanner = notYR;

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

  const badFormat =
    facilityCode.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(facilityCode);
  const notFound = institutionName === 'not found';
  const hasError = badFormat || notFound || notYR;

  const shouldHideAddressInList = (() => {
    const thirdChar = facilityCode?.charAt(2)?.toUpperCase();
    const hasXInThirdPosition =
      facilityCode.length === 8 && !badFormat && thirdChar === 'X';

    if (hasXInThirdPosition) {
      return true;
    }

    return false;
  })();

  const shouldShowAddress =
    hasAddress && !hasError && !shouldHideAddressInList && !isDuplicate;

  return (
    <div aria-live="polite">
      {shouldShowAddress ? (
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

          {!showWarningBanner && (
            <va-additional-info trigger="What to do if this name or address looks incorrect">
              <p>
                After you have verified the facility code is correctly entered,
                if either the facility name or address is incorrect, please
                contact your State Approving Agency (SAA) to have your approval
                updated.&nbsp;
                <va-link
                  text="Go here to find your SAA’s email address"
                  href="https://nasaa-vetseducation.com/nasaa-contacts/"
                  external
                />
              </p>
            </va-additional-info>
          )}
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

export default AdditionalInstitutionAddress;
