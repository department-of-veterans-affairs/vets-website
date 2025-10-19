import PropTypes from 'prop-types';
import React from 'react';

import {
  MemorableDateField,
  NumberField,
  SSNField,
} from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  dateOfBirthSchema,
  ssnSchema,
  vaFileNumberSchema,
  veteranInformationSchema,
} from '../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateOfBirth']);
};

/**
 * Veteran Information page component for the employment information form
 * This page collects veteran's personal identification information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @param {boolean} props.onReviewPage - Whether page is being edited from review
 * @param {Function} props.updatePage - Callback to exit edit mode
 * @returns {JSX.Element} Veteran information form page
 */
export const VeteranInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Veteran's information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranInformationSchema}
      sectionName="veteranInformation"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        fullName: {
          first: '',
          middle: '',
          last: '',
        },
        dateOfBirth: '',
        ssn: '',
        vaFileNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <FullnameField
            name="fullName"
            value={localData.fullName}
            onChange={handleFieldChange}
            errors={errors.fullName || {}}
            forceShowError={formSubmitted}
            label="Veteran's name"
            required
          />

          <MemorableDateField
            name="dateOfBirth"
            label="Date of birth"
            schema={dateOfBirthSchema}
            value={localData.dateOfBirth}
            onChange={handleFieldChange}
            required
            error={errors.dateOfBirth}
            forceShowError={formSubmitted}
          />

          <SSNField
            name="ssn"
            label="Social security number"
            schema={ssnSchema}
            value={localData.ssn}
            onChange={handleFieldChange}
            required
            error={errors.ssn}
            forceShowError={formSubmitted}
          />

          <NumberField
            name="vaFileNumber"
            label="VA file number (if applicable)"
            value={localData.vaFileNumber}
            onChange={handleFieldChange}
            error={errors.vaFileNumber}
            forceShowError={formSubmitted}
            schema={vaFileNumberSchema}
            hint="VA file number must be 8 or 9 digits"
            inputmode="numeric"
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranInformationPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};

export default VeteranInformationPage;
