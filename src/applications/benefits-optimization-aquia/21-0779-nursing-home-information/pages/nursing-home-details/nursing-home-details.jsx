import PropTypes from 'prop-types';
import React from 'react';
import { z } from 'zod';

import { nursingHomeDetailsSchema } from '@bio-aquia/21-0779-nursing-home-information/schemas';
import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

// Schema for nursing home name field
const nursingHomeNameSchema = z
  .string()
  .min(1, 'Nursing home name is required')
  .max(100, 'Nursing home name must be less than 100 characters');

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
      title="Nursing home name and address"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={nursingHomeDetailsSchema}
      sectionName="nursingHomeDetails"
      defaultData={{
        nursingHomeName: '',
        nursingHomeAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <TextInputField
            name="nursingHomeName"
            label="Name of nursing home where you work"
            schema={nursingHomeNameSchema}
            value={localData.nursingHomeName}
            onChange={handleFieldChange}
            required
            error={errors.nursingHomeName}
            forceShowError={formSubmitted}
          />

          <AddressField
            name="nursingHomeAddress"
            label={null}
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
