import PropTypes from 'prop-types';
import React from 'react';

import {
  MemorableDateField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  dateOfBirthSchema,
  firstNameSchema,
  lastNameSchema,
  veteranInformationSchema,
} from '../../schemas';

/**
 * Data processor to ensure date values are properly formatted strings.
 * Transforms date objects to ISO string format for dateOfBirth.
 * @param {Object} formData - The complete form data object
 * @returns {Object} Form data with dates transformed to strings
 */
export const ensureDateStrings = formData => {
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
      title="Who is the Veteran you are providing information for?"
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
        firstName: '',
        lastName: '',
        dateOfBirth: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <TextInputField
            name="firstName"
            label="Veteran's first or given name"
            schema={firstNameSchema}
            value={localData.firstName}
            onChange={handleFieldChange}
            required
            error={errors.firstName}
            forceShowError={formSubmitted}
          />

          <TextInputField
            name="lastName"
            label="Veteran's last or family name"
            schema={lastNameSchema}
            value={localData.lastName}
            onChange={handleFieldChange}
            required
            error={errors.lastName}
            forceShowError={formSubmitted}
          />

          <MemorableDateField
            name="dateOfBirth"
            label="Veteran's date of birth"
            schema={dateOfBirthSchema}
            value={localData.dateOfBirth}
            onChange={handleFieldChange}
            required
            error={errors.dateOfBirth}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default VeteranInformationPage;
