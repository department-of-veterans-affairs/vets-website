import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { BENEFIT_TYPES } from '@bio-aquia/21-2680-house-bound-status/constants';
import {
  benefitTypePageSchema,
  benefitTypeSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

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

  // Determine if claimant is veteran or someone else
  const isVeteran = formDataToUse.claimantRelationship === 'veteran';
  const claimantName = formDataToUse.claimantFullName?.first || 'the claimant';

  return (
    <PageTemplate
      title="Choose your benefit type"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={benefitTypePageSchema}
      sectionName="benefitType"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        benefitType: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <h3>
            Select which benefit {isVeteran ? 'you are' : `${claimantName} is`}{' '}
            applying for.
          </h3>

          <p>
            <strong>Special Monthly Compensation (SMC)</strong> is paid in
            addition to compensation or Dependency Indemnity Compensation (DIC)
            for a service-related disability.
          </p>

          <p>
            <strong>Special Monthly Pension (SMP)</strong> is an increased
            monthly amount paid to a Veteran or survivor who is eligible for
            Veterans Pension or Survivors benefits.
          </p>

          <RadioField
            name="benefitType"
            value={localData.benefitType || ''}
            onChange={handleFieldChange}
            schema={benefitTypeSchema}
            options={[
              {
                label: 'Special Monthly Compensation (SMC)',
                value: BENEFIT_TYPES.SMC,
              },
              {
                label: 'Special Monthly Pension (SMP)',
                value: BENEFIT_TYPES.SMP,
              },
            ]}
            error={errors.benefitType}
            forceShowError={formSubmitted}
            required
          />
        </>
      )}
    </PageTemplate>
  );
};

BenefitTypePage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goForward: PropTypes.func.isRequired,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
