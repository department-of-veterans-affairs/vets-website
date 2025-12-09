import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import { useValidateFacilityCode } from '../hooks/useValidateFacilityCode';
import { useValidateAdditionalFacilityCode } from '../hooks/useValidateAdditionalFacilityCode';

const InstitutionName = ({ uiSchema }) => {
  const formData = useSelector(state => state.form?.data);
  const options = uiSchema?.['ui:options'] || {};
  const { isArrayItem = false } = options;

  const index = isArrayItem ? getArrayIndexFromPathName() : null;

  // Use different hooks based on context
  const mainFacilityHook = useValidateFacilityCode(formData);
  const additionalFacilityHook = useValidateAdditionalFacilityCode(
    formData,
    index,
  );
  const { loader } = isArrayItem ? additionalFacilityHook : mainFacilityHook;

  // Get data from appropriate path
  const institutionName = isArrayItem
    ? formData?.additionalLocations?.[index]?.institutionName
    : formData?.institutionDetails?.institutionName;

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

InstitutionName.propTypes = {
  uiSchema: PropTypes.object,
};

export default InstitutionName;
