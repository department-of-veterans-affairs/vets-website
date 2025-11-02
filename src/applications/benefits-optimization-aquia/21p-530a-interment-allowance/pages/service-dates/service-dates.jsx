import PropTypes from 'prop-types';
import React from 'react';

import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import { z } from 'zod';
import { dateEnteredServiceSchema, dateSeparatedSchema } from '../../schemas';

/**
 * Schema for service dates page
 */
const serviceDatesPageSchema = z
  .object({
    dateFrom: dateEnteredServiceSchema,
    dateTo: dateSeparatedSchema,
  })
  .refine(
    data => {
      // Ensure service start date is before or equal to end date
      if (!data.dateFrom || !data.dateTo) return true;
      const startDate = new Date(data.dateFrom);
      const endDate = new Date(data.dateTo);
      return startDate <= endDate;
    },
    {
      message: 'Service start date must be before end date',
      path: ['dateFrom'],
    },
  );

/**
 * Data processor to ensure date values are properly formatted strings.
 * @param {Object} formData - The complete form data object
 * @returns {Object} Form data with dates transformed to strings
 */
export const ensureDateStrings = formData => {
  if (!formData) {
    return formData;
  }

  return transformDates(formData, ['dateFrom', 'dateTo']);
};

/**
 * Service Dates page component for the interment allowance form.
 * Second page in the service period flow - collects service start and end dates.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @param {boolean} [props.onReviewPage] - Whether the page is being displayed in review mode
 * @param {Function} [props.updatePage] - Function to update the page in review mode
 * @returns {JSX.Element} Service dates form page
 */
export const ServiceDatesPage = ({
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
      title="Service dates"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={serviceDatesPageSchema}
      sectionName="tempServicePeriod"
      dataProcessor={ensureDateStrings}
      defaultData={{
        dateFrom: '',
        dateTo: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please provide the start and end dates for this service period.
          </p>

          <MemorableDateField
            name="dateFrom"
            label="Service start date"
            value={localData.dateFrom || ''}
            onChange={handleFieldChange}
            required
            error={errors.dateFrom}
            forceShowError={formSubmitted}
            schema={dateEnteredServiceSchema}
            hint="If you don't know the exact date, enter your best guess"
          />

          <MemorableDateField
            name="dateTo"
            label="Service end date"
            value={localData.dateTo || ''}
            onChange={handleFieldChange}
            required
            error={errors.dateTo}
            forceShowError={formSubmitted}
            schema={dateSeparatedSchema}
            hint="If you don't know the exact date, enter your best guess"
          />
        </>
      )}
    </PageTemplate>
  );
};

ServiceDatesPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
