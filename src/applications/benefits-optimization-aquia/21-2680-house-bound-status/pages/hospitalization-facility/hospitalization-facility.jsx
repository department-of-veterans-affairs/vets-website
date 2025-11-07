import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import { TextInputField } from '@bio-aquia/shared/components/atoms';

import { hospitalizationFacilityPageSchema } from '@bio-aquia/21-2680-house-bound-status/schemas';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

/**
 * Hospitalization Facility Page
 * Step 4 Page 3 - Hospital name and address
 * @module pages/hospitalization-facility
 */
export const HospitalizationFacilityPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Get claimant information for dynamic title
  const relationship = formDataToUse?.claimantRelationship?.relationship;
  const isVeteran = relationship === 'veteran';
  const claimantName = formDataToUse?.claimantInformation?.claimantFullName;
  const firstName = claimantName?.first || '';
  const lastName = claimantName?.last || '';

  // Format the name for display
  const formattedName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || 'the claimant';

  const pageTitle = isVeteran
    ? "What's the name and address of the hospital where you are admitted?"
    : `What's the name and address of the hospital where ${formattedName} is admitted?`;

  return (
    <PageTemplateWithSaveInProgress
      title={pageTitle}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={hospitalizationFacilityPageSchema}
      sectionName="hospitalizationFacility"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{
        facilityName: '',
        facilityAddress: {
          street: '',
          street2: '',
          street3: '',
          city: '',
          state: '',
          country: 'USA',
          postalCode: '',
          isMilitary: false,
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <TextInputField
            label="Name of hospital"
            name="facilityName"
            value={localData.facilityName || ''}
            onChange={handleFieldChange}
            error={errors.facilityName}
            forceShowError={formSubmitted}
            required
          />

          <AddressField
            name="facilityAddress"
            label="Address of hospital"
            value={localData.facilityAddress}
            onChange={handleFieldChange}
            schema={hospitalizationFacilityPageSchema.shape.facilityAddress}
            errors={
              errors.facilityAddress
                ? {
                    street: errors.facilityAddress?.street,
                    street2: errors.facilityAddress?.street2,
                    street3: errors.facilityAddress?.street3,
                    city: errors.facilityAddress?.city,
                    state: errors.facilityAddress?.state,
                    country: errors.facilityAddress?.country,
                    postalCode: errors.facilityAddress?.postalCode,
                  }
                : undefined
            }
            touched={
              formSubmitted
                ? {
                    street: true,
                    street2: true,
                    street3: true,
                    city: true,
                    state: true,
                    country: true,
                    postalCode: true,
                  }
                : undefined
            }
            required
          />
        </>
      )}
    </PageTemplateWithSaveInProgress>
  );
};

HospitalizationFacilityPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
