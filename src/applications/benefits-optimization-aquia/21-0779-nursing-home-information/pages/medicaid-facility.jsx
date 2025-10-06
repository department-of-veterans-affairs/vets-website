import PropTypes from 'prop-types';
import React from 'react';

import { z } from 'zod';
import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  medicaidFacilitySchema,
  medicaidFacilityStatusSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/medicaid-facility';

// Schema for radio field - allows empty strings and valid values
const medicaidFacilityFieldSchema = z.union([
  z.literal(''),
  medicaidFacilityStatusSchema,
]);

/**
 * Medicaid Facility page component for the nursing home information form
 * This page asks if the nursing home is a Medicaid-approved facility
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Medicaid facility form page
 */
export const MedicaidFacilityPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Medicaid facility status"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={medicaidFacilitySchema}
      sectionName="medicaidFacility"
      defaultData={{
        isMedicaidApproved: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            name="isMedicaidApproved"
            label="Is the nursing home a Medicaid-approved facility?"
            schema={medicaidFacilityFieldSchema}
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
        </>
      )}
    </PageTemplate>
  );
};

MedicaidFacilityPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
