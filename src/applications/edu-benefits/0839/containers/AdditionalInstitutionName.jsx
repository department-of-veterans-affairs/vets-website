import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { useValidateAdditionalFacilityCode } from '../hooks/useValidateAdditionalFacilityCode';

const AdditionalInstitutionName = () => {
  const formData = useSelector(state => state.form?.data); // Use institutionDetails from currrent list and loop iteration
  const { loader } = useValidateAdditionalFacilityCode(formData);
  const institutionName = formData?.institutionDetails?.institutionName; // Use institutionDetails from currrent list and loop iteration

  useEffect(
    () => {
      const facilityCodeInput = document
        .querySelector('va-text-input')
        ?.shadowRoot?.querySelector('input');
      if (!loader && institutionName && facilityCodeInput)
        focusElement(facilityCodeInput);
    },
    [institutionName, loader],
  );

  return (
    <div aria-live="polite">
      {loader ? (
        <va-loading-indicator set-focus message="Finding your institution" />
      ) : (
        <>
          <h3
            id="institutionHeading"
            aria-label={
              institutionName === 'not found'
                ? 'Institution name not found'
                : institutionName
            }
          >
            {institutionName === 'not found' || !institutionName
              ? '--'
              : institutionName}
          </h3>
        </>
      )}
    </div>
  );
};
export default AdditionalInstitutionName;
