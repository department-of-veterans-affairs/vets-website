import PropTypes from 'prop-types';
import React from 'react';

import { DateField } from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  claimantPersonalInfoSchema,
  dateOfBirthSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['claimantDateOfBirth']);
};

/**
 * Claimant Personal Info page component for the nursing home information form
 * This page collects claimant's full name and date of birth
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Claimant personal info form page
 */
export const ClaimantPersonalInfoPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Patient’s name and date of birth"
      subtitle="Tell us about the patient in the nursing home"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantPersonalInfoSchema}
      sectionName="claimantPersonalInfo"
      dataProcessor={ensureDateStrings}
      defaultData={{
        claimantFullName: { first: '', middle: '', last: '' },
        claimantDateOfBirth: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <FullnameField
            className="vads-u-margin-top--neg2"
            value={localData.claimantFullName}
            onChange={handleFieldChange}
            errors={
              errors.claimantFullName &&
              typeof errors.claimantFullName === 'object' &&
              !Array.isArray(errors.claimantFullName)
                ? errors.claimantFullName
                : {}
            }
            required
            showSuffix={false}
            forceShowError={formSubmitted}
            legend={null}
            fieldPrefix="claimant"
          />

          <DateField
            name="claimantDateOfBirth"
            label="Date of birth"
            schema={dateOfBirthSchema}
            value={localData.claimantDateOfBirth}
            onChange={handleFieldChange}
            required
            hint="Enter the date as MM/DD/YYYY"
            error={errors.claimantDateOfBirth}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

ClaimantPersonalInfoPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
