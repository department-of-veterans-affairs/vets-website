import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import {
  PhoneField,
  SelectField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import {
  AddressField,
  FullnameField,
} from '@bio-aquia/shared/components/molecules';
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
export const ClaimantIdentityPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Skip this page if veteran is the claimant
  const isNotVeteranClaimant = formDataToUse.isVeteranClaimant === 'no';
  if (!isNotVeteranClaimant && !onReviewPage) {
    goForward();
    return null;
  }

  return (
    <PageTemplate
      title="Claimant information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantIdentificationSchema}
      sectionName="claimantIdentification"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        claimantFirstName: '',
        claimantMiddleName: '',
        claimantLastName: '',
        claimantStreetAddress: '',
        claimantUnitNumber: '',
        claimantCity: '',
        claimantState: '',
        claimantZip: '',
        claimantPhone: '',
        claimantRelationship: '',
        claimantRelationshipOther: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <fieldset className="vads-u-margin-y--2">
            <legend className="schemaform-block-title">
              <h3 className="vads-u-margin--0">Claimant information</h3>
            </legend>

            <p>
              Enter your information as the person filing on behalf of the
              Veteran.
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
              forceShowError={formSubmitted}
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
              forceShowError={formSubmitted}
            />

            {/* Item 11 - Telephone */}
            <PhoneField
              label="Phone number"
              name="claimantPhone"
              value={localData.claimantPhone || ''}
              onChange={handleFieldChange}
              error={errors.claimantPhone}
              forceShowError={formSubmitted}
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
              forceShowError={formSubmitted}
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
                forceShowError={formSubmitted}
                required
                schema={claimantRelationshipOtherSchema}
              />
            )}
          </fieldset>
        </>
      )}
    </PageTemplate>
  );
};

ClaimantIdentityPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
