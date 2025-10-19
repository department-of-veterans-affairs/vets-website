import PropTypes from 'prop-types';
import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import {
  MemorableDateField,
  SelectField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { ArrayField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import { z } from 'zod';
import {
  formatServicePeriodSummary,
  isServicePeriodEmpty,
  servicePeriodBase,
  servicePeriodsSchema,
} from '../../schemas';

/**
 * Schema for service periods page
 */
const servicePeriodsPageSchema = z.object({
  servicePeriods: servicePeriodsSchema,
});

/**
 * Data processor to ensure date values are properly formatted strings.
 * Transforms date objects to ISO string format for each service period.
 * @param {Object} formData - The complete form data object
 * @returns {Object} Form data with dates transformed to strings
 */
const ensureDateStrings = formData => {
  if (
    !formData ||
    !formData.servicePeriods ||
    !Array.isArray(formData.servicePeriods)
  ) {
    return formData;
  }

  return {
    ...formData,
    servicePeriods: formData.servicePeriods.map(period => {
      // Skip null/undefined items
      if (!period) return period;
      return transformDates(period, ['dateFrom', 'dateTo']);
    }),
  };
};

/**
 * Service Periods page component for the interment allowance form.
 * Allows users to add multiple service periods with branch, start date, and end date.
 * This page is in the "Military history" chapter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @param {boolean} [props.onReviewPage] - Whether the page is being displayed in review mode
 * @param {Function} [props.updatePage] - Function to update the page in review mode
 * @returns {JSX.Element} Service periods form page
 *
 * @example
 * ```jsx
 * <ServicePeriodsPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const ServicePeriodsPage = ({
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
      title="Service periods"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={servicePeriodsPageSchema}
      sectionName="servicePeriods"
      dataProcessor={ensureDateStrings}
      defaultData={{
        servicePeriods: [
          {
            branchOfService: '',
            dateFrom: '',
            dateTo: '',
            placeOfEntry: '',
            placeOfSeparation: '',
            rank: '',
          },
        ],
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please provide information about the veteran’s military service
            periods. You can add multiple service periods if the veteran served
            in different branches or had multiple periods of service.
          </p>

          <ArrayField
            name="servicePeriods"
            value={localData.servicePeriods}
            onChange={handleFieldChange}
            defaultItem={{
              branchOfService: '',
              dateFrom: '',
              dateTo: '',
              placeOfEntry: '',
              placeOfSeparation: '',
              rank: '',
            }}
            itemName="service period"
            addButtonText="Add another service period"
            getItemSummary={formatServicePeriodSummary}
            isItemEmpty={isServicePeriodEmpty}
            errors={errors.servicePeriods}
            required
            renderItem={(item, index, handleItemChange, itemErrors) => {
              // Safety check: ensure item exists
              if (!item) {
                return null;
              }

              return (
                <>
                  <SelectField
                    name="branchOfService"
                    label="Branch of service"
                    value={item?.branchOfService || ''}
                    onChange={(name, value) =>
                      handleItemChange(index, name, value)
                    }
                    required
                    error={itemErrors?.branchOfService}
                    forceShowError={formSubmitted}
                    schema={servicePeriodBase.shape.branchOfService}
                    options={constants.branchesServed}
                  />

                  <MemorableDateField
                    name="dateFrom"
                    label="Service start date"
                    value={item?.dateFrom || ''}
                    onChange={(name, value) =>
                      handleItemChange(index, name, value)
                    }
                    required
                    error={itemErrors?.dateFrom}
                    forceShowError={formSubmitted}
                    schema={servicePeriodBase.shape.dateFrom}
                    hint="If you don't know the exact date, enter your best guess"
                  />

                  <MemorableDateField
                    name="dateTo"
                    label="Service end date"
                    value={item?.dateTo || ''}
                    onChange={(name, value) =>
                      handleItemChange(index, name, value)
                    }
                    required
                    error={itemErrors?.dateTo}
                    forceShowError={formSubmitted}
                    schema={servicePeriodBase.shape.dateTo}
                    hint="If you don't know the exact date, enter your best guess"
                  />

                  <TextInputField
                    name="placeOfEntry"
                    label="Place of entry"
                    value={item?.placeOfEntry || ''}
                    onChange={(name, value) =>
                      handleItemChange(index, name, value)
                    }
                    error={itemErrors?.placeOfEntry}
                    forceShowError={formSubmitted}
                    schema={servicePeriodBase.shape.placeOfEntry}
                    hint="Enter the city and state or name of the military base"
                  />

                  <TextInputField
                    name="placeOfSeparation"
                    label="Place of separation"
                    value={item?.placeOfSeparation || ''}
                    onChange={(name, value) =>
                      handleItemChange(index, name, value)
                    }
                    error={itemErrors?.placeOfSeparation}
                    forceShowError={formSubmitted}
                    schema={servicePeriodBase.shape.placeOfSeparation}
                    hint="Enter the city and state or name of the military base"
                  />

                  <TextInputField
                    name="rank"
                    label="Grade, rank, or rating"
                    value={item?.rank || ''}
                    onChange={(name, value) =>
                      handleItemChange(index, name, value)
                    }
                    error={itemErrors?.rank}
                    forceShowError={formSubmitted}
                    schema={servicePeriodBase.shape.rank}
                  />
                </>
              );
            }}
          />
        </>
      )}
    </PageTemplate>
  );
};

ServicePeriodsPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
