import PropTypes from 'prop-types';
import React from 'react';

import { z } from 'zod';
import {
  FormField,
  MemorableDateField,
} from '@bio-aquia/shared/components/atoms';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';
import { admissionDateSchema, nursingHomeDetailsSchema } from '../schemas';

// Schema for nursing home name field
const nursingHomeNameSchema = z
  .string()
  .min(1, 'Nursing home name is required')
  .max(100, 'Nursing home name must be less than 100 characters');

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
      title="Nursing home facility details"
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
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <FormField
            name="nursingHomeName"
            label="Name of nursing home"
            schema={nursingHomeNameSchema}
            value={localData.nursingHomeName}
            onChange={handleFieldChange}
            required
            error={errors.nursingHomeName}
            forceShowError={formSubmitted}
          />

          <AddressField
            name="nursingHomeAddress"
            label="Complete mailing address of nursing home"
            description=""
            value={localData.nursingHomeAddress}
            onChange={(fieldName, addressValue) =>
              handleFieldChange('nursingHomeAddress', addressValue)
            }
            errors={
              errors.nursingHomeAddress &&
              typeof errors.nursingHomeAddress === 'object'
                ? errors.nursingHomeAddress
                : {}
            }
            touched={
              formSubmitted
                ? { street: true, city: true, state: true, postalCode: true }
                : {}
            }
            allowMilitary={false}
            omitStreet3
          />

          <MemorableDateField
            name="admissionDate"
            label="Date of admission"
            schema={admissionDateSchema}
            value={localData.admissionDate}
            onChange={handleFieldChange}
            required
            hint="Enter the date the patient was admitted to this nursing home"
            error={errors.admissionDate}
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
