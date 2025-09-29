import PropTypes from 'prop-types';
import React from 'react';

import {
  FormField,
  MemorableDateField,
  SSNField,
} from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  dateOfBirthSchema,
  personalInfoSchema,
  ssnSchema,
  vaFileNumberSchema,
} from '../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateOfBirth']);
};

/**
 * Personal Information page component for the nursing home information form
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Personal information form page
 */
export const PersonalInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Personal Information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={personalInfoSchema}
      sectionName="personalInfo"
      dataProcessor={ensureDateStrings}
      defaultData={{
        fullName: { first: '', middle: '', last: '' },
        dateOfBirth: '',
        ssn: '',
        vaFileNumber: '',
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
            showSuffix={false}
            forceShowError={formSubmitted}
          />

          <MemorableDateField
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

          <FormField
            name="vaFileNumber"
            label="VA file number (if known)"
            schema={vaFileNumberSchema}
            value={localData.vaFileNumber}
            onChange={handleFieldChange}
            hint="Your VA file number may be the same as your SSN"
            error={errors.vaFileNumber}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

PersonalInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
