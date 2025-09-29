import PropTypes from 'prop-types';
import React from 'react';

import {
  FormField,
  MemorableDateField,
} from '@bio-aquia/shared/components/atoms';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';
import {
  admissionDateSchema,
  medicaidNumberSchema,
  nursingHomeDetailsSchema,
} from '../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['admissionDate']);
};

/**
 * Nursing Home Details page component for the nursing home information form
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Nursing home details form page
 */
export const NursingHomeDetailsPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Nursing Home Information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={nursingHomeDetailsSchema}
      sectionName="nursingHomeDetails"
      dataProcessor={ensureDateStrings}
      defaultData={{
        nursingHomeName: '',
        nursingHomeAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
        },
        admissionDate: '',
        medicaidNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <FormField
            name="nursingHomeName"
            label="Name of Nursing Home"
            value={localData.nursingHomeName}
            onChange={handleFieldChange}
            required
            error={errors.nursingHomeName}
            forceShowError={formSubmitted}
          />

          <fieldset>
            <legend className="vads-u-font-weight--normal vads-u-font-size--base">
              Complete Mailing Address of Nursing Home
            </legend>
            <AddressField
              value={localData.nursingHomeAddress}
              onChange={value => handleFieldChange('nursingHomeAddress', value)}
              errors={
                errors.nursingHomeAddress &&
                typeof errors.nursingHomeAddress === 'object'
                  ? errors.nursingHomeAddress
                  : {}
              }
              required
              forceShowError={formSubmitted}
              hideCountry
            />
          </fieldset>

          <MemorableDateField
            name="admissionDate"
            label="Date of Admission"
            schema={admissionDateSchema}
            value={localData.admissionDate}
            onChange={handleFieldChange}
            required
            hint="Enter the date you were admitted to this nursing home"
            error={errors.admissionDate}
            forceShowError={formSubmitted}
          />

          <FormField
            name="medicaidNumber"
            label="Medicaid Number (if applicable)"
            schema={medicaidNumberSchema}
            value={localData.medicaidNumber}
            onChange={handleFieldChange}
            hint="Enter your Medicaid number if you have one"
            error={errors.medicaidNumber}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

NursingHomeDetailsPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
