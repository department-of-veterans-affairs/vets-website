import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import { useValidateAdditionalFacilityCode } from '../hooks/useValidateAdditionalFacilityCode';
import { updateFacilityCodeInRedux } from '../utils/updateFacilityCodeInRedux';

const AdditionalInstitutionName = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form?.data);

  const index = getArrayIndexFromPathName();

  const { loader } = useValidateAdditionalFacilityCode(formData, index);

  const details = formData?.additionalLocations?.[index] || {};

  const institutionName = details?.institutionName;
  const facilityCode = (details?.facilityCode || '').trim();

  const additionalFacilityCodes =
    formData?.additionalLocations?.map(item => item?.facilityCode?.trim()) ||
    [];

  const facilityCodes = [
    ...additionalFacilityCodes,
    formData?.institutionDetails?.facilityCode,
  ];

  const isDuplicate =
    facilityCodes?.filter(item => item === facilityCode).length > 1;

  const badFormat =
    facilityCode.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(facilityCode);
  const notFound = institutionName === 'not found';
  const hasError = badFormat || notFound;

  const poeEligible = details.poeEligible === true;

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

  const shouldShowName =
    institutionName && !hasError && !isDuplicate && poeEligible;

  const handleUpdateFacilityCodeInRedux = useCallback(
    value => {
      updateFacilityCodeInRedux(dispatch, formData, index, value);
    },
    [dispatch, formData, index],
  );

  useEffect(
    () => {
      if (index == null) {
        return undefined;
      }

      const input = document.querySelector(
        'va-text-input[data-facility-field="additional-facility-code"]',
      );

      if (!input) {
        return undefined;
      }

      const handleEvent = event => {
        const value = event?.detail?.value ?? event?.target?.value ?? '';
        handleUpdateFacilityCodeInRedux(value);
      };

      input.addEventListener('va-input', handleEvent);
      input.addEventListener('input', handleEvent);

      return () => {
        input.removeEventListener('va-input', handleEvent);
        input.removeEventListener('input', handleEvent);
      };
    },
    [handleUpdateFacilityCodeInRedux, index],
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

export default AdditionalInstitutionName;
