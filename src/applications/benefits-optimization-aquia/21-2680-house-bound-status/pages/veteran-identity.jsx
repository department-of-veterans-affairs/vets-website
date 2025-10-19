import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { SSNField } from '@bio-aquia/shared/components/atoms/ssn-field';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms/memorable-date-field';
import { TextInputField } from '@bio-aquia/shared/components/atoms/text-input-field';
import { FullnameField } from '@bio-aquia/shared/components/molecules/fullname-field';
import {
  veteranSSNSchema,
  veteranFileNumberSchema,
  veteranServiceNumberSchema,
  veteranDOBSchema,
  veteranIdentificationSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Veteran Identity Page
 * Section I - Items 1-5: Veteran identification information
 * @module pages/veteran-identity
 */
const VeteranIdentityPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      schema: veteranIdentificationSchema,
      onSubmit: async updateData => {
        try {
          const validatedData = await veteranIdentificationSchema.parseAsync(
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

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Veteran information</h3>
        </legend>

        <p>Enter the Veteran’s identification information.</p>

        {/* Item 1 - Veteran name */}
        <FullnameField
          value={{
            first: localData.veteranFirstName || '',
            middle: localData.veteranMiddleName || '',
            last: localData.veteranLastName || '',
          }}
          onChange={(_, nameValue) => {
            handleFieldChange('veteranFirstName', nameValue.first);
            handleFieldChange('veteranMiddleName', nameValue.middle);
            handleFieldChange('veteranLastName', nameValue.last);
          }}
          errors={{
            first: errors.veteranFirstName,
            middle: errors.veteranMiddleName,
            last: errors.veteranLastName,
          }}
          required
          legend="Veteran's full name"
          showSuffix={false}
        />

        {/* Item 2 - SSN */}
        <SSNField
          label="Social Security number"
          name="veteranSSN"
          value={localData.veteranSSN || ''}
          onChange={handleFieldChange}
          error={errors.veteranSSN}
          required
          schema={veteranSSNSchema}
        />

        {/* Item 3 - VA file number */}
        <TextInputField
          label="VA file number (if applicable)"
          name="veteranFileNumber"
          value={localData.veteranFileNumber || ''}
          onChange={handleFieldChange}
          error={errors.veteranFileNumber}
          hint="Leave blank if same as SSN or unknown"
          schema={veteranFileNumberSchema}
        />

        {/* Item 4 - Service number */}
        <TextInputField
          label="Service number (if applicable)"
          name="veteranServiceNumber"
          value={localData.veteranServiceNumber || ''}
          onChange={handleFieldChange}
          error={errors.veteranServiceNumber}
          hint="Military service number if different from SSN"
          schema={veteranServiceNumberSchema}
        />

        {/* Item 5 - Date of birth */}
        <MemorableDateField
          label="Date of birth"
          name="veteranDOB"
          value={localData.veteranDOB || ''}
          onChange={handleFieldChange}
          error={errors.veteranDOB}
          required
          schema={veteranDOBSchema}
        />

        {/* Question about claimant */}
        <va-radio
          label="Are you the Veteran?"
          name="isVeteranClaimant"
          value={localData.isVeteranClaimant || ''}
          onVaValueChange={e =>
            handleFieldChange('isVeteranClaimant', e.detail.value)
          }
          error={errors.isVeteranClaimant}
          required
        >
          <va-radio-option label="Yes, I am the Veteran" value="yes" />
          <va-radio-option label="No, I am filing for the Veteran" value="no" />
        </va-radio>
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

VeteranIdentityPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default VeteranIdentityPage;
