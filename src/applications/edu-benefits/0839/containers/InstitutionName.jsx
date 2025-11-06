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

  const shouldHideNameInList =
    isArrayItem &&
    (() => {
      const thirdChar = facilityCode?.charAt(2)?.toUpperCase();
      const hasXInThirdPosition =
        facilityCode.length === 8 && !badFormat && thirdChar === 'X';

      if (hasXInThirdPosition) {
        return true;
      }

      // Check if not attached to main campus
      const mainInstitution = formData?.institutionDetails;
      const branches =
        mainInstitution?.facilityMap?.branches?.map(
          branch => branch?.institution?.facilityCode,
        ) || [];
      const extensions =
        mainInstitution?.facilityMap?.extensions?.map(
          extension => extension?.institution?.facilityCode,
        ) || [];
      const branchList = [...branches, ...extensions];

      if (!branchList.includes(facilityCode)) {
        return true;
      }

      return false;
    })();

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

  const shouldShowName = institutionName && !hasError && !shouldHideNameInList;

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
