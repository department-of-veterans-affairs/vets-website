import PropTypes from 'prop-types';
import React from 'react';

import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import {
  placeEnteredServiceSchema,
  placeSeparatedSchema,
  rankSchema,
} from '../../schemas';

/**
 * Schema for locations and rank page
 */
const locationsAndRankPageSchema = z.object({
  placeOfEntry: placeEnteredServiceSchema.optional(),
  placeOfSeparation: placeSeparatedSchema.optional(),
  rank: rankSchema.optional(),
});

/**
 * Locations and Rank page component for the interment allowance form.
 * Third page in the service period flow - collects locations and rank.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @param {boolean} [props.onReviewPage] - Whether the page is being displayed in review mode
 * @param {Function} [props.updatePage] - Function to update the page in review mode
 * @returns {JSX.Element} Locations and rank form page
 */
export const LocationsAndRankPage = ({
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
  const isEditing = formDataToUse.tempServicePeriod?.isEditing || false;

  // Custom back handler for cancel edit
  const handleBack = () => {
    if (isEditing) {
      // Cancel edit - clear temp data and return to summary
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
      // Normal back navigation
      goBack();
    }
  };

  // Custom forward handler that adds the temp service period to the array
  const handleGoForward = () => {
    const { tempServicePeriod } = formDataToUse;

    if (!tempServicePeriod) {
      goForward();
      return;
    }

    // Get existing service periods or initialize empty array
    const existingPeriods = formDataToUse.servicePeriods || [];

    let updatedPeriods;

    // Check if we're editing an existing period
    if (typeof formDataToUse.editingServicePeriodIndex === 'number') {
      // Replace the period at the editing index
      updatedPeriods = existingPeriods.map(
        (period, index) =>
          index === formDataToUse.editingServicePeriodIndex
            ? tempServicePeriod
            : period,
      );
    } else {
      // Add the temp service period to the array
      updatedPeriods = [...existingPeriods, tempServicePeriod];
    }

    // Update form data with new array and cleared temp object
    const updatedData = {
      ...formDataToUse,
      servicePeriods: updatedPeriods,
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
  };

  return (
    <PageTemplate
      title="Locations and rank"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={handleGoForward}
      goBack={handleBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={locationsAndRankPageSchema}
      sectionName="tempServicePeriod"
      navigationProps={{
        backButtonText: isEditing ? 'Cancel' : 'Back',
      }}
      defaultData={{
        placeOfEntry: '',
        placeOfSeparation: '',
        rank: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please provide additional details about this service period.
          </p>

          <TextInputField
            name="placeOfEntry"
            label="Place of entry"
            value={localData.placeOfEntry || ''}
            onChange={handleFieldChange}
            error={errors.placeOfEntry}
            forceShowError={formSubmitted}
            schema={placeEnteredServiceSchema}
            hint="Enter the city and state or name of the military base"
          />

          <TextInputField
            name="placeOfSeparation"
            label="Place of separation"
            value={localData.placeOfSeparation || ''}
            onChange={handleFieldChange}
            error={errors.placeOfSeparation}
            forceShowError={formSubmitted}
            schema={placeSeparatedSchema}
            hint="Enter the city and state or name of the military base"
          />

          <TextInputField
            name="rank"
            label="Grade, rank, or rating"
            value={localData.rank || ''}
            onChange={handleFieldChange}
            error={errors.rank}
            forceShowError={formSubmitted}
            schema={rankSchema}
          />
        </>
      )}
    </PageTemplate>
  );
};

LocationsAndRankPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
