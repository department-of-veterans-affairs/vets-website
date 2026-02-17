import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { useValidateFacilityCode } from '../hooks/useValidateFacilityCode';

const InstitutionName = () => {
  const formData = useSelector(state => state.form?.data);

  const { loader } = useValidateFacilityCode(formData);

  const details = formData?.institutionDetails;

  const institutionName = details?.institutionName;
  const facilityCode = (details?.facilityCode || '').trim();

  const badFormat =
    facilityCode.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(facilityCode);
  const notFound = institutionName === 'not found';
  const notYR = details.yrEligible === false;
  const hasError = badFormat || notFound || notYR;

  useEffect(() => {
    const facilityCodeInput = document
      .querySelector('va-text-input')
      ?.shadowRoot?.querySelector('input');
    if (!loader && institutionName && facilityCodeInput)
      focusElement(facilityCodeInput);
  }, [institutionName, loader]);

  const shouldShowName = institutionName && !hasError;

  return (
    <div aria-live="polite">
      {loader ? (
        <va-loading-indicator set-focus message="Finding your institution" />
      ) : (
        <>
          <h3
            id="institutionHeading"
            aria-label={
              shouldShowName ? institutionName : 'Institution name not found'
            }
          >
            {shouldShowName ? institutionName : '--'}
          </h3>
        </>
      )}
    </div>
  );
};

export default InstitutionName;
