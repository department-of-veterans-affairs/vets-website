import PropTypes from 'prop-types';
import React from 'react';
import { z } from 'zod';

// Force webpack rebuild - using React bindings
import {
  FormField,
  MemorableDateField,
  RadioField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import { medicaidAndCostSchema } from '@bio-aquia/21-0779-nursing-home-information/schemas';

// Individual field schemas for RadioField components - used for real-time field validation
// This properly validates yes/no fields
const yesNoSchema = z
  .enum(['yes', 'no'])
  .or(z.literal(''))
  .refine(value => value === 'yes' || value === 'no', {
    message: 'Please select Yes or No',
  });

// Schema for monthly out-of-pocket amount
const monthlyOutOfPocketFieldSchema = z
  .string()
  .min(1, 'Monthly out-of-pocket amount is required')
  .refine(val => {
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    return !Number.isNaN(num) && num >= 0;
  }, 'Please enter a valid dollar amount');

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['medicaidStartDate']);
};

/**
 * Medicaid and Cost Information page component for the nursing home information form
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Medicaid and cost information form page
 */
export const MedicaidAndCostPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Medicaid and cost information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={medicaidAndCostSchema}
      sectionName="medicaidAndCost"
      dataProcessor={ensureDateStrings}
      defaultData={{
        isMedicaidApproved: '',
        hasAppliedForMedicaid: '',
        isCurrentlyCovered: '',
        medicaidStartDate: '',
        monthlyOutOfPocket: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            name="isMedicaidApproved"
            label="Is the nursing home Medicaid-approved?"
            schema={yesNoSchema}
            value={localData.isMedicaidApproved}
            onChange={handleFieldChange}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            required
            error={errors.isMedicaidApproved}
            forceShowError={formSubmitted}
          />

          <RadioField
            name="hasAppliedForMedicaid"
            label="Has the patient applied for Medicaid?"
            schema={yesNoSchema}
            value={localData.hasAppliedForMedicaid}
            onChange={handleFieldChange}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            required
            error={errors.hasAppliedForMedicaid}
            forceShowError={formSubmitted}
          />

          <RadioField
            name="isCurrentlyCovered"
            label="Is the patient currently covered by Medicaid?"
            schema={yesNoSchema}
            value={localData.isCurrentlyCovered}
            onChange={handleFieldChange}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            required
            error={errors.isCurrentlyCovered}
            forceShowError={formSubmitted}
          />

          {localData.isCurrentlyCovered === 'yes' && (
            <MemorableDateField
              name="medicaidStartDate"
              label="Medicaid start date"
              value={localData.medicaidStartDate}
              onChange={handleFieldChange}
              required
              hint="Enter the date Medicaid coverage began"
              error={errors.medicaidStartDate}
              forceShowError={formSubmitted}
            />
          )}

          <va-additional-info
            trigger="Note about state Medicaid programs"
            class="vads-u-margin-y--2"
          >
            <p>
              Your state’s Medicaid program may use another name. For example,
              California calls it Medi-Cal, and Massachusetts calls it
              MassHealth.
            </p>
          </va-additional-info>

          <FormField
            name="monthlyOutOfPocket"
            label="Monthly out-of-pocket amount paid to nursing home ($)"
            schema={monthlyOutOfPocketFieldSchema}
            value={localData.monthlyOutOfPocket}
            onChange={handleFieldChange}
            required
            inputMode="numeric"
            hint="Enter the amount the patient pays out-of-pocket each month (enter 0 if nothing)"
            error={errors.monthlyOutOfPocket}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

MedicaidAndCostPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
