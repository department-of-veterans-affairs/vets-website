import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms/memorable-date-field';
import { AddressField } from '@bio-aquia/shared/components/molecules/address-field';
import { TextInputField } from '@bio-aquia/shared/components/atoms/text-input-field';
import {
  admissionDateSchema,
  facilityNameSchema,
  hospitalizationSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Hospitalization Page
 * Section IV - Items 14A-14D: Hospitalization information
 * @module pages/hospitalization
 */
const HospitalizationPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      schema: hospitalizationSchema,
      onSubmit: async updateData => {
        try {
          const validatedData = await hospitalizationSchema.parseAsync(
            updateData,
          );
          updatePage(validatedData);
          goForward();
        } catch (error) {
          // Validation error is handled by the form
        }
      },
    },
  );

  const isHospitalized = localData.isCurrentlyHospitalized === 'yes';

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Hospitalization information</h3>
        </legend>

        <p>
          Provide details about current hospitalization or nursing home care.
        </p>

        {/* Item 14A - Currently hospitalized */}
        <va-radio
          label="Are you (or the Veteran) currently hospitalized or in a nursing home?"
          name="isCurrentlyHospitalized"
          value={localData.isCurrentlyHospitalized || ''}
          onVaValueChange={e =>
            handleFieldChange('isCurrentlyHospitalized', e.detail.value)
          }
          error={errors.isCurrentlyHospitalized}
          required
        >
          <va-radio-option label="Yes" value="yes" />
          <va-radio-option label="No" value="no" />
        </va-radio>

        {isHospitalized && (
          <>
            {/* Item 14B - Admission date */}
            <MemorableDateField
              label="Date of admission"
              name="admissionDate"
              value={localData.admissionDate || ''}
              onChange={handleFieldChange}
              error={errors.admissionDate}
              required
              schema={admissionDateSchema}
            />

            {/* Item 14C - Facility name */}
            <TextInputField
              label="Name of hospital or nursing home"
              name="facilityName"
              value={localData.facilityName || ''}
              onChange={handleFieldChange}
              error={errors.facilityName}
              required
              schema={facilityNameSchema}
            />

            {/* Item 14D - Facility address */}
            <AddressField
              name="facilityAddress"
              label="Facility address"
              value={{
                street: localData.facilityStreetAddress || '',
                city: localData.facilityCity || '',
                state: localData.facilityState || '',
                country: 'USA',
                postalCode: localData.facilityZip || '',
              }}
              onChange={(_, addressValue) => {
                handleFieldChange('facilityStreetAddress', addressValue.street);
                handleFieldChange('facilityCity', addressValue.city);
                handleFieldChange('facilityState', addressValue.state);
                handleFieldChange('facilityZip', addressValue.postalCode);
              }}
              allowMilitary={false}
              errors={{
                street: errors.facilityStreetAddress,
                city: errors.facilityCity,
                state: errors.facilityState,
                postalCode: errors.facilityZip,
              }}
            />
          </>
        )}
      </fieldset>

      <div className="vads-u-margin-top--4">
        <va-button back onClick={goBack}>
          Back
        </va-button>
        <va-button continue type="submit">
          Continue
        </va-button>
      </div>
    </form>
  );
};

HospitalizationPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default HospitalizationPage;
