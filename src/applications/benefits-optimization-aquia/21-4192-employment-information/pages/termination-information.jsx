import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';

/**
 * Termination Information Page
 * Section II (continued) - Collects termination details and final payments
 * Only shown if veteran is no longer employed
 * @module pages/termination-information
 */
const TerminationInformationPage = ({
  data,
  goBack,
  goForward,
  updatePage,
}) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      // schema: terminationInformationSchema,
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
          <h3 className="vads-u-margin--0">Termination information</h3>
        </legend>

        <p>
          Since the Veteran is no longer employed with this organization, please
          provide termination and final payment details.
        </p>

        {/* Termination reason - Item 14A */}
        <va-textarea
          label="Reason for termination of employment"
          name="terminationReason"
          value={localData.terminationReason || ''}
          onInput={e => handleFieldChange('terminationReason', e.target.value)}
          error={errors.terminationReason}
          required
          hint="Be specific. If retired on disability, please specify. Examples: resigned, laid off, retired on disability"
          maxlength="300"
        />

        {/* Date last worked - Item 14B */}
        <va-memorable-date
          label="Date last worked"
          name="dateLastWorked"
          monthSelect
          value={localData.dateLastWorked || ''}
          onDateChange={e =>
            handleFieldChange('dateLastWorked', e.target.value)
          }
          onDateBlur={() => {}}
          error={errors.dateLastWorked}
          required
          hint="The last day the Veteran physically worked"
        />

        {/* Last payment date - Item 15A */}
        <va-memorable-date
          label="Date of last payment"
          name="dateLastPayment"
          monthSelect
          value={localData.dateLastPayment || ''}
          onDateChange={e =>
            handleFieldChange('dateLastPayment', e.target.value)
          }
          onDateBlur={() => {}}
          error={errors.dateLastPayment}
          required
          hint="Date of final paycheck"
        />

        {/* Last payment amount - Item 15B */}
        <va-text-input
          label="Gross amount of last payment"
          name="lastPaymentAmount"
          value={localData.lastPaymentAmount || ''}
          onInput={e => handleFieldChange('lastPaymentAmount', e.target.value)}
          error={errors.lastPaymentAmount}
          required
          hint="Amount before deductions. Enter numbers only."
          inputmode="decimal"
          type="number"
          min="0"
          step="0.01"
        />

        {/* Lump sum payment - Item 16A */}
        <va-radio
          label="Was a lump sum payment made?"
          name="lumpSumMade"
          value={localData.lumpSumMade || ''}
          onVaValueChange={e =>
            handleFieldChange('lumpSumMade', e.detail.value)
          }
          error={errors.lumpSumMade}
          required
          hint="Examples: severance pay, PTO cashout"
        >
          <va-radio-option label="Yes" value="yes" />
          <va-radio-option label="No" value="no" />
        </va-radio>

        {/* Conditional lump sum details */}
        {localData.lumpSumMade === 'yes' && (
          <>
            {/* Lump sum amount - Item 16A (amount) */}
            <va-text-input
              label="Gross amount of lump sum payment"
              name="lumpSumAmount"
              value={localData.lumpSumAmount || ''}
              onInput={e => handleFieldChange('lumpSumAmount', e.target.value)}
              error={errors.lumpSumAmount}
              required
              hint="Amount before deductions"
              inputmode="decimal"
              type="number"
              min="0"
              step="0.01"
            />

            {/* Lump sum date - Item 16B */}
            <va-memorable-date
              label="Date lump sum was paid"
              name="lumpSumDate"
              monthSelect
              value={localData.lumpSumDate || ''}
              onDateChange={e =>
                handleFieldChange('lumpSumDate', e.target.value)
              }
              onDateBlur={() => {}}
              error={errors.lumpSumDate}
              required
            />
          </>
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

TerminationInformationPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default TerminationInformationPage;
