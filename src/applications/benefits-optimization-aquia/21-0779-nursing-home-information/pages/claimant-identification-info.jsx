import PropTypes from 'prop-types';
import React from 'react';

import { NumberField, SSNField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  claimantIdentificationInfoSchema,
  ssnSchema,
  vaFileNumberSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas';

/**
 * Claimant Identification Info page component for the nursing home information form
 * This page collects claimant's SSN and VA file number
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Claimant identification info form page
 */
export const ClaimantIdentificationInfoPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Patient's identification information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantIdentificationInfoSchema}
      sectionName="claimantIdentificationInfo"
      defaultData={{
        claimantSsn: '',
        claimantVaFileNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p>
            You must enter the patient’s Social Security number. You can also
            enter a VA File number if available.
          </p>

          <SSNField
            name="claimantSsn"
            label="Social Security number"
            schema={ssnSchema}
            value={localData.claimantSsn}
            onChange={handleFieldChange}
            required
            error={errors.claimantSsn}
            forceShowError={formSubmitted}
          />

          <NumberField
            name="claimantVaFileNumber"
            label="VA file number (if known)"
            schema={vaFileNumberSchema}
            value={localData.claimantVaFileNumber}
            onChange={handleFieldChange}
            hint="The VA file number may be the same as their SSN"
            error={errors.claimantVaFileNumber}
            forceShowError={formSubmitted}
            inputmode="numeric"
          />
        </>
      )}
    </PageTemplate>
  );
};

ClaimantIdentificationInfoPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
