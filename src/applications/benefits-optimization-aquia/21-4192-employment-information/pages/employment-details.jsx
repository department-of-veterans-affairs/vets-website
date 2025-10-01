import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { TIME_LOST_UNITS } from '@bio-aquia/21-4192-employment-information/constants';

/**
 * Employment Details Page
 * Section II - Collects employment dates, duties, earnings, and accommodations
 * @module pages/employment-details
 */
const EmploymentDetailsPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      // schema: employmentDetailsSchema,
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
          <h3 className="vads-u-margin--0">Employment information</h3>
        </legend>

        <p>
          Enter the Veteran’s employment information as recorded by the
          employer.
        </p>

        {/* Employment dates - Item 7 & 8 */}
        <va-memorable-date
          label="Beginning date of employment"
          name="employmentStartDate"
          monthSelect
          value={localData.employmentStartDate || ''}
          onDateChange={e =>
            handleFieldChange('employmentStartDate', e.target.value)
          }
          onDateBlur={() => {}}
          error={errors.employmentStartDate}
          required
          hint="The date the Veteran started working for this employer"
        />

        <va-memorable-date
          label="Ending date of employment (if applicable)"
          name="employmentEndDate"
          monthSelect
          value={localData.employmentEndDate || ''}
          onDateChange={e =>
            handleFieldChange('employmentEndDate', e.target.value)
          }
          onDateBlur={() => {}}
          error={errors.employmentEndDate}
          hint="Leave blank if still employed. If still employed, note in Remarks section."
        />

        {/* Type of work - Item 9 */}
        <va-textarea
          label="Type of work performed"
          name="typeOfWork"
          value={localData.typeOfWork || ''}
          onInput={e => handleFieldChange('typeOfWork', e.target.value)}
          error={errors.typeOfWork}
          required
          hint="Job title and brief description of duties"
          maxlength="200"
        />

        {/* Earnings - Item 10 */}
        <va-text-input
          label="Amount earned during 12 months before last date of employment"
          name="earnings12Months"
          value={localData.earnings12Months || ''}
          onInput={e => handleFieldChange('earnings12Months', e.target.value)}
          error={errors.earnings12Months}
          required={!!localData.employmentEndDate}
          hint="Gross amount before deductions. Enter numbers only, no commas or dollar signs."
          inputmode="decimal"
          type="number"
          min="0"
          step="0.01"
        />

        {/* Time lost - Item 11 */}
        <fieldset>
          <legend className="vads-u-font-size--md vads-u-font-weight--bold">
            Time lost during last 12 months due to disability
          </legend>

          <va-text-input
            label="Amount of time lost"
            name="timeLostAmount"
            value={localData.timeLostAmount || ''}
            onInput={e => handleFieldChange('timeLostAmount', e.target.value)}
            error={errors.timeLostAmount}
            hint="Enter the number of days or hours"
            type="number"
            min="0"
          />

          <va-radio
            label="Unit of time"
            name="timeLostUnit"
            value={localData.timeLostUnit || ''}
            onVaValueChange={e =>
              handleFieldChange('timeLostUnit', e.detail.value)
            }
            error={errors.timeLostUnit}
          >
            <va-radio-option label="Days" value={TIME_LOST_UNITS.DAYS} />
            <va-radio-option label="Hours" value={TIME_LOST_UNITS.HOURS} />
          </va-radio>
        </fieldset>

        {/* Hours worked - Item 12A & 12B */}
        <va-text-input
          label="Number of hours worked daily (typical/average)"
          name="hoursWorkedDaily"
          value={localData.hoursWorkedDaily || ''}
          onInput={e => handleFieldChange('hoursWorkedDaily', e.target.value)}
          error={errors.hoursWorkedDaily}
          required
          type="number"
          min="0"
          max="24"
          step="0.5"
        />

        <va-text-input
          label="Number of hours worked weekly (typical/average)"
          name="hoursWorkedWeekly"
          value={localData.hoursWorkedWeekly || ''}
          onInput={e => handleFieldChange('hoursWorkedWeekly', e.target.value)}
          error={errors.hoursWorkedWeekly}
          required
          type="number"
          min="0"
          max="168"
          step="0.5"
        />

        {/* Concessions - Item 13 */}
        <va-textarea
          label="Concessions made by employer due to age or disability"
          name="concessions"
          value={localData.concessions || ''}
          onInput={e => handleFieldChange('concessions', e.target.value)}
          error={errors.concessions}
          hint="Examples: light duty, flexible schedule, lifting assistance. Enter 'None' if no concessions were made."
          maxlength="500"
        />

        {/* Remarks - Item 22 (placed here for context) */}
        <va-textarea
          label="Remarks (optional)"
          name="remarks"
          value={localData.remarks || ''}
          onInput={e => handleFieldChange('remarks', e.target.value)}
          error={errors.remarks}
          hint="Use to explain unusual cases, still-employed status, or missing data"
          maxlength="1000"
        />
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

EmploymentDetailsPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EmploymentDetailsPage;
