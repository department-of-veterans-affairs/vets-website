import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { useVaFacilityCode } from '../hooks/useVaFacilityCode';

const InstitutionName = () => {
  const formData = useSelector(state => state.form?.data);
  const institutionName = formData?.institutionDetails?.institutionName;
  const loader = formData?.institutionDetails?.loader;
  useVaFacilityCode();

  useEffect(
    () => {
      // Re-focus
      const facilityCodeInput = document
        .querySelector('va-text-input')
        ?.shadowRoot?.querySelector('input');
      if (!loader && institutionName) focusElement(facilityCodeInput);
    },
    [institutionName, loader],
  );

  return (
    <div aria-live="polite">
      {loader ? (
        <va-loading-indicator
          data-testid="loader"
          set-focus
          message="Finding your institution"
        />
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

export default InstitutionName;
