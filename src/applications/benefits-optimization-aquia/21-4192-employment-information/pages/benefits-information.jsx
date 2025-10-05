<<<<<<< HEAD
import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  benefitEntitlementSchema,
  benefitsInformationSchema,
} from '../schemas';

/**
 * Benefits Information page component
 * This page collects information about benefit entitlements
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Benefits information form page
 */
export const BenefitsInformationPage = ({
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
      title="Benefits information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={benefitsInformationSchema}
      sectionName="benefitsInformation"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        benefitEntitlement: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <h3 className="vads-u-margin-top--0">
            Benefit entitlement and/or payments
          </h3>

          <RadioField
            name="benefitEntitlement"
            label="Is the Veteran receiving or entitled to receive, as a result of his/her employment with you, sick, retirement or other benefits?"
            schema={benefitEntitlementSchema}
            value={localData.benefitEntitlement}
            onChange={handleFieldChange}
            error={errors.benefitEntitlement}
            forceShowError={formSubmitted}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </>
      )}
    </PageTemplate>
=======
import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';

/**
 * Benefits Information Page
 * Section IV - Information on Benefit Entitlement and/or Payments
 * @module pages/benefits-information
 */
const BenefitsInformationPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      // schema: benefitsInformationSchema,
      onSubmit: updateData => {
        updatePage(updateData);
        goForward();
      },
    },
  );

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Benefit entitlement and payments</h3>
        </legend>

        <p>
          Please provide information about any benefits the Veteran is receiving
          or entitled to receive as a result of their employment.
        </p>

        {/* Benefits question - Item 18 */}
        <va-radio
          label="Is the Veteran receiving or entitled to receive sick, retirement, or other benefits as a result of employment?"
          name="hasEmploymentBenefits"
          value={localData.hasEmploymentBenefits || ''}
          onVaValueChange={e =>
            handleFieldChange('hasEmploymentBenefits', e.detail.value)
          }
          error={errors.hasEmploymentBenefits}
          required
        >
          <va-radio-option label="Yes" value="yes" />
          <va-radio-option label="No" value="no" />
        </va-radio>

        {/* Conditional benefits details */}
        {localData.hasEmploymentBenefits === 'yes' && (
          <>
            <va-alert status="info" show-icon class="vads-u-margin-y--2">
              <h4 slot="headline">Benefits information required</h4>
              <p>
                Since the Veteran is receiving or entitled to employment
                benefits, please provide details about these benefits.
              </p>
            </va-alert>

            {/* Type of benefit - Item 19 */}
            <va-text-input
              label="Type of benefit"
              name="benefitType"
              value={localData.benefitType || ''}
              onInput={e => handleFieldChange('benefitType', e.target.value)}
              error={errors.benefitType}
              required
              hint="Examples: pension, long-term disability (LTD), workers compensation"
              maxlength="100"
            />

            {/* Monthly amount - Item 20 */}
            <va-text-input
              label="Gross monthly amount of benefit"
              name="benefitMonthlyAmount"
              value={localData.benefitMonthlyAmount || ''}
              onInput={e =>
                handleFieldChange('benefitMonthlyAmount', e.target.value)
              }
              error={errors.benefitMonthlyAmount}
              required
              hint="Amount before deductions. Enter numbers only."
              inputmode="decimal"
              type="number"
              min="0"
              step="0.01"
            />

            {/* Date benefit began - Item 21A */}
            <va-memorable-date
              label="Date benefit began"
              name="benefitBeganDate"
              monthSelect
              value={localData.benefitBeganDate || ''}
              onDateChange={e =>
                handleFieldChange('benefitBeganDate', e.target.value)
              }
              onDateBlur={() => {}}
              error={errors.benefitBeganDate}
              required
              hint="Start of entitlement, not necessarily when payments began"
            />

            {/* First payment date - Item 21B */}
            <va-memorable-date
              label="Date first payment was issued"
              name="benefitFirstPaymentDate"
              monthSelect
              value={localData.benefitFirstPaymentDate || ''}
              onDateChange={e =>
                handleFieldChange('benefitFirstPaymentDate', e.target.value)
              }
              onDateBlur={() => {}}
              error={errors.benefitFirstPaymentDate}
              required
              hint="Date the first payment was actually issued"
            />

            {/* End date - Item 21C */}
            <va-memorable-date
              label="Date benefit will stop (if known)"
              name="benefitEndDate"
              monthSelect
              value={localData.benefitEndDate || ''}
              onDateChange={e =>
                handleFieldChange('benefitEndDate', e.target.value)
              }
              onDateBlur={() => {}}
              error={errors.benefitEndDate}
              hint="Leave blank if unknown or if benefits continue indefinitely"
            />

            {/* Additional benefits */}
            <va-radio
              label="Are there any additional employment-related benefits?"
              name="hasAdditionalBenefits"
              value={localData.hasAdditionalBenefits || ''}
              onVaValueChange={e =>
                handleFieldChange('hasAdditionalBenefits', e.detail.value)
              }
              error={errors.hasAdditionalBenefits}
            >
              <va-radio-option label="Yes" value="yes" />
              <va-radio-option label="No" value="no" />
            </va-radio>

            {localData.hasAdditionalBenefits === 'yes' && (
              <va-textarea
                label="Describe additional benefits"
                name="additionalBenefitsDescription"
                value={localData.additionalBenefitsDescription || ''}
                onInput={e =>
                  handleFieldChange(
                    'additionalBenefitsDescription',
                    e.target.value,
                  )
                }
                error={errors.additionalBenefitsDescription}
                hint="Include type, amount, and dates for each additional benefit"
                maxlength="500"
              />
            )}
          </>
        )}

        {localData.hasEmploymentBenefits === 'no' && (
          <va-alert status="info" show-icon class="vads-u-margin-top--2">
            <p className="vads-u-margin--0">
              You’ve indicated that the Veteran is not receiving any
              employment-related benefits. Please continue to the next section.
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
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
  );
};

BenefitsInformationPage.propTypes = {
<<<<<<< HEAD
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
=======
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
};

export default BenefitsInformationPage;
