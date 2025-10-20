import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { BENEFIT_TYPES } from '@bio-aquia/21-2680-house-bound-status/constants';
import { benefitTypePageSchema } from '@bio-aquia/21-2680-house-bound-status/schemas';

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
      {({ localData, handleFieldChange, errors, _formSubmitted }) => (
        <>
          <p>
            Select the type of benefit you’re applying for. This determines how
            your eligibility will be evaluated.
          </p>

          <va-radio
            label="Select benefit type"
            name="benefitType"
            value={localData.benefitType || ''}
            onVaValueChange={e =>
              handleFieldChange('benefitType', e.detail.value)
            }
            error={errors.benefitType}
            required
          >
            <va-radio-option
              label="SMC - Special Monthly Compensation"
              value={BENEFIT_TYPES.SMC}
              description="For Veterans with service-connected disabilities. This provides additional compensation for specific disabilities requiring Aid and Attendance or resulting in being Housebound."
            />
            <va-radio-option
              label="SMP - Special Monthly Pension"
              value={BENEFIT_TYPES.SMP}
              description="For Veterans or survivors receiving Pension benefits. This provides additional monetary assistance if you need Aid and Attendance or are Housebound."
            />
          </va-radio>

          {localData.benefitType === BENEFIT_TYPES.SMC && (
            <va-alert status="info" show-icon class="vads-u-margin-top--2">
              <p className="vads-u-margin--0">
                <strong>SMC benefits</strong> are for Veterans with
                service-connected disabilities who need regular aid and
                attendance or are housebound due to their service-connected
                conditions.
              </p>
            </va-alert>
          )}

          {localData.benefitType === BENEFIT_TYPES.SMP && (
            <va-alert status="info" show-icon class="vads-u-margin-top--2">
              <p className="vads-u-margin--0">
                <strong>SMP benefits</strong> are for Veterans or survivors
                receiving Pension who need regular aid and attendance or are
                housebound, regardless of whether the conditions are
                service-connected.
              </p>
            </va-alert>
          )}
        </>
      )}
    </PageTemplate>
  );
};

BenefitTypePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
