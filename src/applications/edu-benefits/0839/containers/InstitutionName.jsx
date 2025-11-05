import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import { useValidateFacilityCode } from '../hooks/useValidateFacilityCode';
import { useValidateAdditionalFacilityCode } from '../hooks/useValidateAdditionalFacilityCode';

const InstitutionName = ({ uiSchema }) => {
  const formData = useSelector(state => state.form?.data);
  const options = uiSchema?.['ui:options'] || {};
  const { dataPath = 'institutionDetails', isArrayItem = false } = options;

  const index = isArrayItem ? getArrayIndexFromPathName() : null;

  // Use different hooks based on context
  const mainFacilityHook = useValidateFacilityCode(formData);
  const additionalFacilityHook = useValidateAdditionalFacilityCode(
    formData,
    index,
  );
  const { loader } = isArrayItem ? additionalFacilityHook : mainFacilityHook;

  // Get data from appropriate path
  const details = isArrayItem
    ? formData?.[dataPath]?.[index] || {}
    : formData?.[dataPath] || {};

  const institutionName = details?.institutionName;
  const facilityCode = (details?.facilityCode || '').trim();

  const badFormat =
    facilityCode.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(facilityCode);
  const notFound = institutionName === 'not found';
  const notIHL = details.ihlEligible === false;
  const notYR = details.yrEligible === false;
  const hasError = badFormat || notFound || notYR || notIHL;

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
              hasError || !institutionName
                ? 'Institution name not found'
                : institutionName
            }
          >
            {hasError || !institutionName ? '--' : institutionName}
          </h3>
        </>
      )}
    </div>
  );
};

export default InstitutionName;
