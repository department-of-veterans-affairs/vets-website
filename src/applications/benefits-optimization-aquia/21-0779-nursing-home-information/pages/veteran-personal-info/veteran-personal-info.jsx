import PropTypes from 'prop-types';
import React from 'react';

import { DateField } from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  dateOfBirthSchema,
  veteranPersonalInfoSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateOfBirth']);
};

/**
 * Veteran Personal Info page component for the nursing home information form
 * This page collects veteran's full name and date of birth
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Veteran personal info form page
 */
export const VeteranPersonalInfoPage = ({
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
      title="Veteran’s name and date of birth"
      subtitle={
        veteranIsPatient
          ? 'Tell us about the veteran in the nursing home'
          : 'Tell us about the Veteran who is connected to the patient'
      }
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranPersonalInfoSchema}
      sectionName="veteranPersonalInfo"
      dataProcessor={ensureDateStrings}
      defaultData={{
        fullName: { first: '', middle: '', last: '' },
        dateOfBirth: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <FullnameField
            value={localData.fullName}
            onChange={handleFieldChange}
            errors={
              errors.fullName &&
              typeof errors.fullName === 'object' &&
              !Array.isArray(errors.fullName)
                ? errors.fullName
                : {}
            }
            required
            legend={null}
            showSuffix={false}
            forceShowError={formSubmitted}
          />

          <DateField
            name="dateOfBirth"
            label="Date of birth"
            schema={dateOfBirthSchema}
            value={localData.dateOfBirth}
            onChange={handleFieldChange}
            required
            hint="Enter the date as MM/DD/YYYY"
            error={errors.dateOfBirth}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranPersonalInfoPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
