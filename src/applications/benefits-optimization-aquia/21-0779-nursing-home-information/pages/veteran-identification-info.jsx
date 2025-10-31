import PropTypes from 'prop-types';
import React from 'react';

import { NumberField, SSNField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  ssnSchema,
  vaFileNumberSchema,
  veteranIdentificationInfoSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas';

/**
 * Veteran Identification Info page component for the nursing home information form
 * This page collects veteran's SSN and VA file number
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Veteran identification info form page
 */
export const VeteranIdentificationInfoPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Conditionals for veteran information content display
  const { claimantQuestion } = formDataToUse;
  const veteranIsPatient = claimantQuestion?.patientType === 'veteran';

  return (
    <PageTemplate
      title="Veteran’s identification information"
      subtitle={
        veteranIsPatient
          ? 'You must enter either a Social Security number or VA File number'
          : 'You must enter either a Social Security number or VA File number for the Veteran who is connected to the patient'
      }
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranIdentificationInfoSchema}
      sectionName="veteranIdentificationInfo"
      defaultData={{
        ssn: '',
        vaFileNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <SSNField
            name="ssn"
            label="Social Security number"
            schema={ssnSchema}
            value={localData.ssn}
            onChange={handleFieldChange}
            required
            error={errors.ssn}
            forceShowError={formSubmitted}
          />

          <NumberField
            name="vaFileNumber"
            label="VA file number (if known)"
            schema={vaFileNumberSchema}
            value={localData.vaFileNumber}
            onChange={handleFieldChange}
            hint="VA file number may be the same as SSN"
            error={errors.vaFileNumber}
            forceShowError={formSubmitted}
            inputmode="numeric"
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranIdentificationInfoPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
