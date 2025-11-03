import PropTypes from 'prop-types';
import React from 'react';

import {
  nursingOfficialFirstNameSchema,
  nursingOfficialInformationSchema,
  nursingOfficialJobTitleSchema,
  nursingOfficialLastNameSchema,
  nursingOfficialPhoneNumberSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/nursing-official-information';
import { PhoneField, TextInputField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

/**
 * Nursing Official Information page component for the nursing home information form
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Nursing official information form page
 */
export const NursingOfficialInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Nursing home official personal information"
      subtitle="Only an official representative from a nursing home can fill out this form."
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={nursingOfficialInformationSchema}
      sectionName="nursingOfficialInformation"
      defaultData={{
        firstName: '',
        lastName: '',
        jobTitle: '',
        phoneNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <TextInputField
            name="firstName"
            label="Your first name"
            schema={nursingOfficialFirstNameSchema}
            value={localData.firstName}
            onChange={handleFieldChange}
            required
            error={errors.firstName}
            forceShowError={formSubmitted}
          />

          <TextInputField
            name="lastName"
            label="Your last name"
            schema={nursingOfficialLastNameSchema}
            value={localData.lastName}
            onChange={handleFieldChange}
            required
            error={errors.lastName}
            forceShowError={formSubmitted}
          />

          <TextInputField
            name="jobTitle"
            label="Your nursing home job title"
            schema={nursingOfficialJobTitleSchema}
            value={localData.jobTitle}
            onChange={handleFieldChange}
            required
            error={errors.jobTitle}
            forceShowError={formSubmitted}
          />

          <PhoneField
            name="phoneNumber"
            label="Your phone number"
            schema={nursingOfficialPhoneNumberSchema}
            value={localData.phoneNumber}
            onChange={handleFieldChange}
            required
            error={errors.phoneNumber}
            forceShowError={formSubmitted}
            hint="We'll use this number to contact you if we have any questions about this form."
          />
        </>
      )}
    </PageTemplate>
  );
};

NursingOfficialInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
