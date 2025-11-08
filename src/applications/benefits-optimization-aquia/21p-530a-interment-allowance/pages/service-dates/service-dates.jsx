import PropTypes from 'prop-types';
import React from 'react';

import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import constants from 'vets-json-schema/dist/constants.json';

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
  goToPath,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Check if we're editing an existing service period
  // Only show "Cancel edit" if there are existing service periods and we're editing
  const hasExistingPeriods = (formDataToUse.servicePeriods || []).length > 0;
  const isEditingExisting =
    typeof formDataToUse.editingServicePeriodIndex === 'number';
  const isAddingAnother = hasExistingPeriods && !isEditingExisting;
  const shouldShowCancelEdit = isEditingExisting || isAddingAnother;

  // Custom back handler for cancel edit
  const handleBack = () => {
    if (shouldShowCancelEdit) {
      // Cancel edit/add - clear temp data and return to summary
      const updatedData = {
        ...formDataToUse,
        tempServicePeriod: {
          branchOfService: '',
          dateFrom: '',
          dateTo: '',
          placeOfEntry: '',
          placeOfSeparation: '',
          rank: '',
          isEditing: false,
        },
        editingServicePeriodIndex: undefined,
      };
      setFormData(updatedData);
      goToPath('/service-periods');
    } else {
      // Normal back navigation (first time through)
      goBack();
    }
  };

  // Get proper title
  const { tempServicePeriod } = formDataToUse;
  // Find matching branch label from constants
  const branchOption = constants.branchesServed.find(
    branch => branch.value === tempServicePeriod.branchOfService,
  );
  const branchLabel = branchOption
    ? branchOption.label
    : tempServicePeriod.branchOfService || '';

  const pageTitle = `${branchLabel}`;

  return (
    <PageTemplate
      title={pageTitle}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={handleBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={serviceDatesPageSchema}
      sectionName="tempServicePeriod"
      dataProcessor={ensureDateStrings}
      navigationProps={{
        backButtonText: shouldShowCancelEdit ? 'Cancel' : 'Back',
      }}
      defaultData={{
        dateFrom: '',
        dateTo: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <MemorableDateField
            name="dateFrom"
            label="Service start date"
            monthSelect
            value={localData.dateFrom || ''}
            onChange={handleFieldChange}
            required
            remove-date-hint
            error={errors.dateFrom}
            forceShowError={formSubmitted}
            schema={dateEnteredServiceSchema}
          />

          <MemorableDateField
            name="dateTo"
            label="Service end date"
            monthSelect
            value={localData.dateTo || ''}
            onChange={handleFieldChange}
            required
            remove-date-hint
            error={errors.dateTo}
            forceShowError={formSubmitted}
            schema={dateSeparatedSchema}
          />
        </>
      )}
    </PageTemplate>
  );
};

ServiceDatesPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
