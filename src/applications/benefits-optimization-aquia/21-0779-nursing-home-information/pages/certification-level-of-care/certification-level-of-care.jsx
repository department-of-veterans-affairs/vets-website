import PropTypes from 'prop-types';
import React from 'react';
import { z } from 'zod';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { certificationLevelOfCareSchema } from '@bio-aquia/21-0779-nursing-home-information/schemas';

// Schema for level of care radio field - used for real-time field validation
// This properly validates the required field
const levelOfCareFieldSchema = z
  .enum(['skilled', 'intermediate'])
  .or(z.literal(''))
  .refine(value => value === 'skilled' || value === 'intermediate', {
    message: 'Please select the level of care being provided',
  });

/**
 * Certification Level of Care page component for the nursing home information form
 * This page certifies that the patient is receiving skilled or intermediate care
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Certification level of care form page
 */
export const CertificationLevelOfCarePage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Dynamic label that uses the claimant name if the patient is not the veteran
  // pitfall: claimantPersonalInfo will be undefined if veteran is the patient
  const {
    claimantQuestion,
    claimantPersonalInfo = {},
    veteranPersonalInfo,
  } = formDataToUse;
  const { fullName = {} } = veteranPersonalInfo;
  const { claimantFullName = {} } = claimantPersonalInfo;

  const veteranIsPatient = claimantQuestion?.patientType === 'veteran';

  const patientName = veteranIsPatient
    ? `${fullName?.first || ''} ${fullName?.last || ''}`.trim()
    : `${claimantFullName?.first || ''} ${claimantFullName?.last || ''}`.trim();

  const dynamicRadioLabel = `I certify that the claimant ${patientName} is a patient in this facility because of a mental or physical disability and is receiving`;

  return (
    <PageTemplate
      title="Certification of level of care"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={certificationLevelOfCareSchema}
      sectionName="certificationLevelOfCare"
      defaultData={{
        levelOfCare: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <RadioField
          name="levelOfCare"
          label={dynamicRadioLabel}
          schema={levelOfCareFieldSchema}
          value={localData.levelOfCare}
          onChange={handleFieldChange}
          options={[
            {
              label: 'Skilled nursing care',
              value: 'skilled',
            },
            {
              label: 'Intermediate nursing care',
              value: 'intermediate',
            },
          ]}
          required
          error={errors.levelOfCare}
          forceShowError={formSubmitted}
        />
      )}
    </PageTemplate>
  );
};

CertificationLevelOfCarePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
