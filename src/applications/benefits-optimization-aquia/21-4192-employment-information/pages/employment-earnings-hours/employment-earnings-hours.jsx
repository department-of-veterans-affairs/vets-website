import PropTypes from 'prop-types';
import React from 'react';

import {
  CurrencyField,
  NumberField,
  TextareaField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  amountEarnedSchema,
  dailyHoursSchema,
  employmentEarningsHoursSchema,
  timeLostSchema,
  typeOfWorkSchema,
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

  // Get veteran name
  const veteranInfo = formDataToUse?.veteranInformation || {};
  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  // Determine if currently employed to use correct tense
  const currentlyEmployed =
    formDataToUse?.employmentDates?.currentlyEmployed || false;
  const tense = currentlyEmployed ? 'does' : 'did';
  const timeframe = currentlyEmployed
    ? 'last 12 months'
    : '12 months before their last date of employment';

  return (
    <PageTemplate
      title={`Details about ${veteranName}'s employment`}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={employmentEarningsHoursSchema}
      sectionName="employmentEarningsHours"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        typeOfWork: '',
        amountEarned: '',
        timeLost: '',
        dailyHours: '',
        weeklyHours: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <TextareaField
            name="typeOfWork"
            label={`What type of work ${tense} ${veteranName} do?`}
            value={localData.typeOfWork}
            onChange={handleFieldChange}
            error={errors.typeOfWork}
            forceShowError={formSubmitted}
            schema={typeOfWorkSchema}
            rows={5}
            maxLength={1000}
          />

          <CurrencyField
            name="amountEarned"
            label={`How much ${tense} ${veteranName} earn in the ${timeframe} (before deductions)?`}
            value={localData.amountEarned}
            onChange={handleFieldChange}
            error={errors.amountEarned}
            forceShowError={formSubmitted}
            schema={amountEarnedSchema}
          />

          <TextInputField
            name="timeLost"
            label={`How much time ${tense} ${veteranName} lose to disability in ${timeframe}?`}
            value={localData.timeLost}
            onChange={handleFieldChange}
            error={errors.timeLost}
            forceShowError={formSubmitted}
            schema={timeLostSchema}
            maxlength={100}
          />

          <NumberField
            name="dailyHours"
            label={`How many hours ${tense} ${veteranName} work each day?`}
            value={localData.dailyHours}
            onChange={handleFieldChange}
            error={errors.dailyHours}
            forceShowError={formSubmitted}
            schema={dailyHoursSchema}
          />

          <NumberField
            name="weeklyHours"
            label={`How many hours ${tense} ${veteranName} work each week?`}
            value={localData.weeklyHours}
            onChange={handleFieldChange}
            error={errors.weeklyHours}
            forceShowError={formSubmitted}
            schema={weeklyHoursSchema}
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
