import PropTypes from 'prop-types';
import React from 'react';

import {
  RadioField,
  MemorableDateField,
  SSNField,
} from '@bio-aquia/shared/components/atoms';
import {
  FullnameField,
  AddressField,
} from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  claimantRelationshipSchema,
  claimantDOBSchema,
  claimantSSNSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';
import { z } from 'zod';
import { transformDates } from '@bio-aquia/shared/forms';

// Schema that validates all claimant fields based on relationship
const comprehensiveSchema = z
  .object({
    claimantRelationship: claimantRelationshipSchema,
  })
  .passthrough();

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['claimantDOB']);
};

/**
 * Claimant Relationship Page
 * Shows ALL claimant fields in one place for easy editing
 * @module pages/claimant-relationship
 */
export const ClaimantRelationshipPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Merge all claimant data from different sections for editing
  // Also migrate old camelCase field names to new uppercase names
  const mergedData = {
    claimantRelationship:
      formDataToUse?.claimantRelationship?.claimantRelationship || '',
    claimantFullName: formDataToUse?.claimantInformation?.claimantFullName || {
      first: '',
      middle: '',
      last: '',
    },
    claimantDOB:
      formDataToUse?.claimantInformation?.claimantDOB ||
      formDataToUse?.claimantInformation?.claimantDob ||
      '',
    claimantSSN:
      formDataToUse?.claimantSSN?.claimantSSN ||
      formDataToUse?.claimantSSN?.claimantSsn ||
      formDataToUse?.claimantSsn?.claimantSSN ||
      formDataToUse?.claimantSsn?.claimantSsn ||
      '',
    claimantAddress: formDataToUse?.claimantAddress?.claimantAddress || {
      street: '',
      city: '',
      state: '',
      country: 'USA',
      postalCode: '',
    },
    claimantPhoneNumber:
      formDataToUse?.claimantContact?.claimantPhoneNumber || '',
    claimantMobilePhone:
      formDataToUse?.claimantContact?.claimantMobilePhone || '',
    claimantEmail: formDataToUse?.claimantContact?.claimantEmail || '',
  };

  // Custom save handler to distribute data to correct sections
  const handleSave = updatedData => {
    const isVeteran = updatedData.claimantRelationship === 'veteran';

    setFormData({
      ...formDataToUse,
      claimantRelationship: {
        claimantRelationship: updatedData.claimantRelationship,
      },
      claimantInformation: isVeteran
        ? {}
        : {
            claimantFullName: updatedData.claimantFullName,
            claimantDOB: updatedData.claimantDOB,
          },
      claimantSSN: isVeteran
        ? {}
        : {
            claimantSSN: updatedData.claimantSSN,
          },
      claimantAddress: isVeteran
        ? {}
        : {
            claimantAddress: updatedData.claimantAddress,
          },
      claimantContact: isVeteran
        ? {}
        : {
            claimantPhoneNumber: updatedData.claimantPhoneNumber,
            claimantMobilePhone: updatedData.claimantMobilePhone,
            claimantEmail: updatedData.claimantEmail,
          },
    });
  };

  return (
    <PageTemplate
      title="Claimant information"
      data={mergedData}
      setFormData={handleSave}
      goForward={goForward}
      goBack={goBack}
      schema={comprehensiveSchema}
      sectionName="comprehensive"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={mergedData}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => {
        const isVeteran = localData.claimantRelationship === 'veteran';

        return (
          <>
            <RadioField
              label="Who is the claim for?"
              name="claimantRelationship"
              value={localData.claimantRelationship || ''}
              onChange={handleFieldChange}
              schema={claimantRelationshipSchema}
              options={[
                { label: 'Veteran', value: 'veteran' },
                { label: "Veteran's spouse", value: 'spouse' },
                { label: "Veteran's child", value: 'child' },
                { label: "Veteran's parent", value: 'parent' },
              ]}
              error={errors.claimantRelationship}
              forceShowError={formSubmitted}
              required
            />

            {!isVeteran &&
              localData.claimantRelationship && (
                <>
                  <h3 className="vads-u-margin-top--4">Personal information</h3>

                  <FullnameField
                    fieldPrefix="claimant"
                    value={localData.claimantFullName}
                    onChange={handleFieldChange}
                    errors={errors.claimantFullName || {}}
                    forceShowError={formSubmitted}
                    required
                    showSuffix={false}
                  />

                  <MemorableDateField
                    label="Date of birth"
                    name="claimantDOB"
                    value={localData.claimantDOB || ''}
                    onChange={handleFieldChange}
                    error={errors.claimantDOB}
                    forceShowError={formSubmitted}
                    required
                    schema={claimantDOBSchema}
                  />

                  <SSNField
                    label="Social Security number"
                    name="claimantSSN"
                    value={localData.claimantSSN || ''}
                    onChange={handleFieldChange}
                    error={errors.claimantSSN}
                    forceShowError={formSubmitted}
                    required
                    schema={claimantSSNSchema}
                  />

                  <h3 className="vads-u-margin-top--4">Address</h3>

                  <AddressField
                    fieldPrefix="claimant"
                    value={localData.claimantAddress}
                    onChange={handleFieldChange}
                    errors={errors.claimantAddress || {}}
                    forceShowError={formSubmitted}
                    required
                    label="Claimant's address"
                  />

                  <h3 className="vads-u-margin-top--4">Contact information</h3>

                  <va-text-input
                    label="Phone number"
                    name="claimantPhoneNumber"
                    value={localData.claimantPhoneNumber || ''}
                    onInput={e =>
                      handleFieldChange('claimantPhoneNumber', e.target.value)
                    }
                    error={errors.claimantPhoneNumber}
                    required
                    type="tel"
                  />

                  <va-text-input
                    label="Mobile phone number (optional)"
                    name="claimantMobilePhone"
                    value={localData.claimantMobilePhone || ''}
                    onInput={e =>
                      handleFieldChange('claimantMobilePhone', e.target.value)
                    }
                    error={errors.claimantMobilePhone}
                    type="tel"
                  />

                  <va-text-input
                    label="Email address"
                    name="claimantEmail"
                    value={localData.claimantEmail || ''}
                    onInput={e =>
                      handleFieldChange('claimantEmail', e.target.value)
                    }
                    error={errors.claimantEmail}
                    required
                    type="email"
                  />
                </>
              )}

            {isVeteran && (
              <va-alert status="info" className="vads-u-margin-top--4">
                <h3 slot="headline">Veteran information</h3>
                <p>
                  You indicated that you are filing this claim for yourself as
                  the Veteran. We’ll use your information from the "Veteran’s
                  information" section.
                </p>
              </va-alert>
            )}
          </>
        );
      }}
    </PageTemplate>
  );
};

ClaimantRelationshipPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
