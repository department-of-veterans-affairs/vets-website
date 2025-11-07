import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';

import { BENEFIT_TYPES } from '@bio-aquia/21-2680-house-bound-status/constants';
import {
  benefitTypePageSchema,
  benefitTypeSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

/**
 * Benefit Type Page
 * Item 13 - Choose SMC or SMP benefit type
 * @module pages/benefit-type
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @param {boolean} props.onReviewPage - Whether page is being edited from review
 * @param {Function} props.updatePage - Callback to exit edit mode
 * @returns {JSX.Element} Benefit type form page
 */
export const BenefitTypePage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Ensure benefitType section exists
  const migratedData = {
    ...formDataToUse,
    benefitType: {
      benefitType: formDataToUse?.benefitType?.benefitType,
    },
  };

  // Get claimant information for dynamic label
  const relationship = migratedData?.claimantRelationship?.relationship;
  const isVeteran = relationship === 'veteran';
  const claimantName = migratedData?.claimantInformation?.claimantFullName;
  const firstName = claimantName?.first || '';
  const lastName = claimantName?.last || '';

  // Format the name for display
  const formattedName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || 'the claimant';

  const questionText = isVeteran
    ? 'Select which benefit you are applying for'
    : `Select which benefit ${formattedName} is applying for`;

  return (
    <PageTemplateWithSaveInProgress
      title={questionText}
      data={migratedData}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={benefitTypePageSchema}
      sectionName="benefitType"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{}}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <div className="benefit-type-page">
          <p>
            <a
              href="https://www.va.gov/pension/aid-attendance-housebound/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find out more about the difference between Special Monthly
              Compensation (SMC) and Special Monthly Pension (SMP).
            </a>
          </p>

          <RadioField
            name="benefitType"
            label="Select benefit type"
            value={localData.benefitType}
            onChange={handleFieldChange}
            schema={benefitTypeSchema}
            tile
            options={[
              {
                label: 'Special Monthly Compensation (SMC)',
                value: BENEFIT_TYPES.SMC,
                description:
                  'is paid in addition to compensation or Dependency Indemnity Compensation (DIC) for a service-related disability.',
              },
              {
                label: 'Special Monthly Pension (SMP)',
                value: BENEFIT_TYPES.SMP,
                description:
                  'is an increased monthly amount paid to a Veteran or survivor who is eligible for Veterans Pension or Survivors benefits.',
              },
            ]}
            error={errors.benefitType}
            forceShowError={formSubmitted}
            required
          />
        </div>
      )}
    </PageTemplateWithSaveInProgress>
  );
};

BenefitTypePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
