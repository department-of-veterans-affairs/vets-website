import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { PhoneField } from '@bio-aquia/shared/components/atoms/phone-field';
import { SelectField } from '@bio-aquia/shared/components/atoms/select-field';
import { AddressField } from '@bio-aquia/shared/components/molecules/address-field';
import { FullnameField } from '@bio-aquia/shared/components/molecules/fullname-field';
import { TextInputField } from '@bio-aquia/shared/components/atoms/text-input-field';
import {
  claimantPhoneSchema,
  claimantRelationshipSchema,
  claimantRelationshipOtherSchema,
  claimantIdentificationSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Claimant Identity Page
 * Section II - Items 6-12: Claimant identification information
 * @module pages/claimant-identity
 */
const ClaimantIdentityPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      schema: claimantIdentificationSchema,
      onSubmit: async updateData => {
        try {
          const validatedData = await claimantIdentificationSchema.parseAsync(
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

  const isNotVeteranClaimant = localData.isVeteranClaimant === 'no';

  if (!isNotVeteranClaimant) {
    goForward();
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Claimant information</h3>
        </legend>

        <p>
          Enter your information as the person filing on behalf of the Veteran.
        </p>

        {/* Item 6 - Claimant name */}
        <FullnameField
          value={{
            first: localData.claimantFirstName || '',
            middle: localData.claimantMiddleName || '',
            last: localData.claimantLastName || '',
          }}
          onChange={(_, nameValue) => {
            handleFieldChange('claimantFirstName', nameValue.first);
            handleFieldChange('claimantMiddleName', nameValue.middle);
            handleFieldChange('claimantLastName', nameValue.last);
          }}
          errors={{
            first: errors.claimantFirstName,
            middle: errors.claimantMiddleName,
            last: errors.claimantLastName,
          }}
          required
          legend="Claimant's full name"
          showSuffix={false}
        />

        {/* Items 7-10 - Address */}
        <AddressField
          name="claimantAddress"
          label="Claimant address"
          value={{
            street: localData.claimantStreetAddress || '',
            street2: localData.claimantUnitNumber || '',
            city: localData.claimantCity || '',
            state: localData.claimantState || '',
            country: 'USA',
            postalCode: localData.claimantZip || '',
          }}
          onChange={(_, addressValue) => {
            handleFieldChange('claimantStreetAddress', addressValue.street);
            handleFieldChange('claimantUnitNumber', addressValue.street2);
            handleFieldChange('claimantCity', addressValue.city);
            handleFieldChange('claimantState', addressValue.state);
            handleFieldChange('claimantZip', addressValue.postalCode);
          }}
          allowMilitary={false}
          errors={{
            street: errors.claimantStreetAddress,
            city: errors.claimantCity,
            state: errors.claimantState,
            postalCode: errors.claimantZip,
          }}
        />

        {/* Item 11 - Telephone */}
        <PhoneField
          label="Phone number"
          name="claimantPhone"
          value={localData.claimantPhone || ''}
          onChange={handleFieldChange}
          error={errors.claimantPhone}
          required
          schema={claimantPhoneSchema}
        />

        {/* Item 12 - Relationship */}
        <SelectField
          label="Relationship to Veteran"
          name="claimantRelationship"
          value={localData.claimantRelationship || ''}
          onChange={handleFieldChange}
          error={errors.claimantRelationship}
          required
          schema={claimantRelationshipSchema}
          options={[
            { value: 'spouse', label: 'Spouse' },
            { value: 'child', label: 'Child' },
            { value: 'parent', label: 'Parent' },
            { value: 'guardian', label: 'Legal Guardian' },
            { value: 'fiduciary', label: 'Fiduciary' },
            { value: 'other', label: 'Other' },
          ]}
        />

        {localData.claimantRelationship === 'other' && (
          <TextInputField
            label="Please specify relationship"
            name="claimantRelationshipOther"
            value={localData.claimantRelationshipOther || ''}
            onChange={handleFieldChange}
            error={errors.claimantRelationshipOther}
            required
            schema={claimantRelationshipOtherSchema}
          />
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

ClaimantIdentityPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default ClaimantIdentityPage;
