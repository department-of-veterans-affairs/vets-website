import PropTypes from 'prop-types';
import React from 'react';

import {
  CurrencyField,
  NumberField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  amountEarnedSchema,
  dailyHoursSchema,
  employmentEarningsHoursSchema,
  timeLostSchema,
  weeklyHoursSchema,
} from '../../schemas';

/**
 * Employment Earnings and Hours page component
 * This page collects earnings and hours information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Employment earnings and hours form page
 */
export const EmploymentEarningsHoursPage = ({
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
      title="Employment information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={employmentEarningsHoursSchema}
      sectionName="employmentEarningsHours"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        amountEarned: '',
        timeLost: '',
        dailyHours: '',
        weeklyHours: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <CurrencyField
            name="amountEarned"
            label="Amount earned during 12 months preceding last date of Employment (before deductions)"
            value={localData.amountEarned}
            onChange={handleFieldChange}
            error={errors.amountEarned}
            forceShowError={formSubmitted}
            schema={amountEarnedSchema}
          />

          <TextInputField
            name="timeLost"
            label="Time lost during 12 months preceding last date of employment (due to disability)"
            value={localData.timeLost}
            onChange={handleFieldChange}
            error={errors.timeLost}
            forceShowError={formSubmitted}
            schema={timeLostSchema}
            maxlength={100}
          />

          <NumberField
            name="dailyHours"
            label="Number of hours worked (daily)"
            value={localData.dailyHours}
            onChange={handleFieldChange}
            error={errors.dailyHours}
            forceShowError={formSubmitted}
            schema={dailyHoursSchema}
            hint="Enter the number of hours worked per day"
          />

          <NumberField
            name="weeklyHours"
            label="Number of hours worked (weekly)"
            value={localData.weeklyHours}
            onChange={handleFieldChange}
            error={errors.weeklyHours}
            forceShowError={formSubmitted}
            schema={weeklyHoursSchema}
            hint="Enter the number of hours worked per week"
          />
        </>
      )}
    </PageTemplate>
  );
};

EmploymentEarningsHoursPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default EmploymentEarningsHoursPage;
