import PropTypes from 'prop-types';
import React from 'react';

import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
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
      title="Claimant personal information"
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
          <va-additional-info
            trigger="Why we ask for claimant information"
            class="vads-u-margin-y--2"
          >
            <p>
              If the person in the nursing home is a spouse or parent of a
              Veteran, we need their information to process the Aid and
              Attendance claim.
            </p>
          </va-additional-info>

          <FullnameField
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
            label="Claimant's full name"
            fieldPrefix="claimant"
          />

          <MemorableDateField
            name="claimantDateOfBirth"
            label="Claimant's date of birth"
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
