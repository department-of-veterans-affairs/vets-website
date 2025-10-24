import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import { TextInputField } from '@bio-aquia/shared/components/atoms';

import { hospitalizationFacilityPageSchema } from '@bio-aquia/21-2680-house-bound-status/schemas';

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

  // Get claimant name from previous pages
  const claimantName = formDataToUse.claimantFullName?.first || 'the claimant';

  return (
    <PageTemplate
      title={`What's the name and address of the hospital where ${claimantName} is admitted?`}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={hospitalizationFacilityPageSchema}
      sectionName="hospitalizationFacility"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
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
            label="Hospital address"
            description="Enter the address of the hospital."
            value={localData.facilityAddress}
            onChange={handleFieldChange}
            schema={hospitalizationFacilityPageSchema.shape.facilityAddress}
            errors={
              formSubmitted && errors.facilityAddress
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
            required
          />
        </>
      )}
    </PageTemplate>
  );
};

HospitalizationFacilityPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
