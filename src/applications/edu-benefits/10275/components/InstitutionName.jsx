/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { useValidateFacilityCode } from '../hooks/useValidateFacilityCode';

const InstitutionName = () => {
  const formData = useSelector(state => state.form?.data);
  const { loader } = useValidateFacilityCode(formData);
  const institutionName = formData?.institutionDetails?.institutionName;

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

  useEffect(
    () => {
      const wc = document.querySelector('va-text-input');
      if (!wc || loader) return;

      if (institutionName === 'not found') {
        wc.setAttribute(
          'error',
          'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        );
      } else if (institutionName === 'not valid') {
        wc.setAttribute(
          'error',
          'This institution is unable to participate in the Principles of Excellence.',
        );
      } else {
        wc.removeAttribute('error');
      }
    },
    [loader, institutionName],
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
                : institutionName === 'not valid'
                  ? 'Institution name is not valid for Principles of Excellence'
                  : institutionName
            }
          >
            {institutionName === 'not found' ||
            institutionName === 'not valid' ||
            !institutionName
              ? '--'
              : institutionName}
          </h3>
        </>
      )}
    </div>
  );
};
export default InstitutionName;
