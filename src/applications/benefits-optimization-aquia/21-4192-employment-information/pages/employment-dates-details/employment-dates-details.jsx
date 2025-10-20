import PropTypes from 'prop-types';
import React from 'react';

import {
  CurrencyField,
  MemorableDateField,
  NumberField,
  TextareaField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  amountEarnedSchema,
  beginningDateSchema,
  dailyHoursSchema,
  employmentDatesDetailsSchema,
  endingDateSchema,
  timeLostSchema,
  typeOfWorkSchema,
  weeklyHoursSchema,
} from '../../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['beginningDate', 'endingDate']);
};

/**
 * Employment Dates and Details page component
 * This page collects employment dates, work type, earnings, and hours information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Employment dates and details form page
 */
export const EmploymentDatesDetailsPage = ({
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
      schema={employmentDatesDetailsSchema}
      sectionName="employmentDatesDetails"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        beginningDate: '',
        endingDate: '',
        typeOfWork: '',
        amountEarned: '',
        timeLost: '',
        dailyHours: '',
        weeklyHours: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <MemorableDateField
            name="beginningDate"
            label="Beginning date of employment"
            schema={beginningDateSchema}
            value={localData.beginningDate}
            onChange={handleFieldChange}
            error={errors.beginningDate}
            forceShowError={formSubmitted}
          />

          <MemorableDateField
            name="endingDate"
            label="Ending date of employment"
            schema={endingDateSchema}
            value={localData.endingDate}
            onChange={handleFieldChange}
            error={errors.endingDate}
            forceShowError={formSubmitted}
          />

          <TextareaField
            name="typeOfWork"
            label="Type of work performed"
            schema={typeOfWorkSchema}
            value={localData.typeOfWork}
            onChange={handleFieldChange}
            error={errors.typeOfWork}
            forceShowError={formSubmitted}
            rows={5}
            maxLength={1000}
          />

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

EmploymentDatesDetailsPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};

export default EmploymentDatesDetailsPage;
