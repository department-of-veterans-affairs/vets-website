import PropTypes from 'prop-types';
import React from 'react';
import { z } from 'zod';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  currentMedicaidStatusSchema,
  medicaidStatusSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/medicaid-status';

// Schema for radio field - allows empty strings and valid values
const medicaidStatusFieldSchema = z.union([
  z.literal(''),
  medicaidStatusSchema,
]);

/**
 * Medicaid Status page component for the nursing home information form
 * This page asks if the patient is covered by Medicaid
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Medicaid status form page
 */
export const MedicaidStatusPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Medicaid status"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={currentMedicaidStatusSchema}
      sectionName="medicaidStatus"
      defaultData={{
        currentlyCoveredByMedicaid: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            name="currentlyCoveredByMedicaid"
            label="Is the patient covered by Medicaid?"
            schema={medicaidStatusFieldSchema}
            value={localData.currentlyCoveredByMedicaid}
            onChange={handleFieldChange}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            required
            error={errors.currentlyCoveredByMedicaid}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

MedicaidStatusPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
