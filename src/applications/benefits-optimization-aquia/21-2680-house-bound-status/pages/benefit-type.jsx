import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { BENEFIT_TYPES } from '@bio-aquia/21-2680-house-bound-status/constants';
import { benefitTypePageSchema } from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Benefit Type Page
 * Item 13 - Choose SMC or SMP benefit type
 * @module pages/benefit-type
 */
const BenefitTypePage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      schema: benefitTypePageSchema,
      onSubmit: async updateData => {
        try {
          const validatedData = await benefitTypePageSchema.parseAsync(
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
          <h3 className="vads-u-margin--0">Choose your benefit type</h3>
        </legend>

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
              service-connected disabilities who need regular aid and attendance
              or are housebound due to their service-connected conditions.
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

BenefitTypePage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default BenefitTypePage;
