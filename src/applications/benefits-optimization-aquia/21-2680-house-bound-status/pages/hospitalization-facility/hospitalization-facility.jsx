import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import {
  TextInputField,
  SelectField,
} from '@bio-aquia/shared/components/atoms';

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
        facilityStreetAddress: '',
        facilityCity: '',
        facilityState: '',
        facilityZip: '',
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

          <fieldset className="vads-u-margin-y--2">
            <legend className="vads-u-font-weight--bold vads-u-margin-bottom--1">
              Hospital address
            </legend>

            <TextInputField
              label="Street address"
              name="facilityStreetAddress"
              value={localData.facilityStreetAddress || ''}
              onChange={handleFieldChange}
              error={errors.facilityStreetAddress}
              forceShowError={formSubmitted}
              required
            />

            <TextInputField
              label="City"
              name="facilityCity"
              value={localData.facilityCity || ''}
              onChange={handleFieldChange}
              error={errors.facilityCity}
              forceShowError={formSubmitted}
              required
            />

            <SelectField
              label="State"
              name="facilityState"
              value={localData.facilityState || ''}
              onChange={handleFieldChange}
              error={errors.facilityState}
              forceShowError={formSubmitted}
              required
              options={[
                { value: '', label: '- Select -' },
                { value: 'AL', label: 'Alabama' },
                { value: 'AK', label: 'Alaska' },
                { value: 'AZ', label: 'Arizona' },
                { value: 'AR', label: 'Arkansas' },
                { value: 'CA', label: 'California' },
                { value: 'CO', label: 'Colorado' },
                { value: 'CT', label: 'Connecticut' },
                { value: 'DE', label: 'Delaware' },
                { value: 'DC', label: 'District Of Columbia' },
                { value: 'FL', label: 'Florida' },
                { value: 'GA', label: 'Georgia' },
                { value: 'HI', label: 'Hawaii' },
                { value: 'ID', label: 'Idaho' },
                { value: 'IL', label: 'Illinois' },
                { value: 'IN', label: 'Indiana' },
                { value: 'IA', label: 'Iowa' },
                { value: 'KS', label: 'Kansas' },
                { value: 'KY', label: 'Kentucky' },
                { value: 'LA', label: 'Louisiana' },
                { value: 'ME', label: 'Maine' },
                { value: 'MD', label: 'Maryland' },
                { value: 'MA', label: 'Massachusetts' },
                { value: 'MI', label: 'Michigan' },
                { value: 'MN', label: 'Minnesota' },
                { value: 'MS', label: 'Mississippi' },
                { value: 'MO', label: 'Missouri' },
                { value: 'MT', label: 'Montana' },
                { value: 'NE', label: 'Nebraska' },
                { value: 'NV', label: 'Nevada' },
                { value: 'NH', label: 'New Hampshire' },
                { value: 'NJ', label: 'New Jersey' },
                { value: 'NM', label: 'New Mexico' },
                { value: 'NY', label: 'New York' },
                { value: 'NC', label: 'North Carolina' },
                { value: 'ND', label: 'North Dakota' },
                { value: 'OH', label: 'Ohio' },
                { value: 'OK', label: 'Oklahoma' },
                { value: 'OR', label: 'Oregon' },
                { value: 'PA', label: 'Pennsylvania' },
                { value: 'RI', label: 'Rhode Island' },
                { value: 'SC', label: 'South Carolina' },
                { value: 'SD', label: 'South Dakota' },
                { value: 'TN', label: 'Tennessee' },
                { value: 'TX', label: 'Texas' },
                { value: 'UT', label: 'Utah' },
                { value: 'VT', label: 'Vermont' },
                { value: 'VA', label: 'Virginia' },
                { value: 'WA', label: 'Washington' },
                { value: 'WV', label: 'West Virginia' },
                { value: 'WI', label: 'Wisconsin' },
                { value: 'WY', label: 'Wyoming' },
              ]}
            />

            <TextInputField
              label="ZIP code"
              name="facilityZip"
              value={localData.facilityZip || ''}
              onChange={handleFieldChange}
              error={errors.facilityZip}
              forceShowError={formSubmitted}
              required
              hint="5 or 9 digits"
            />
          </fieldset>
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
