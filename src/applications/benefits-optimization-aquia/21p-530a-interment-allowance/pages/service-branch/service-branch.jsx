import PropTypes from 'prop-types';
import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';

import { SelectField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import { branchOfServiceSchema } from '../../schemas';

/**
 * Schema for service branch page
 */
const serviceBranchPageSchema = z.object({
  branchOfService: branchOfServiceSchema,
});

/**
 * Service Branch page component for the interment allowance form.
 * First page in the service period flow - collects branch of service.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @param {boolean} [props.onReviewPage] - Whether the page is being displayed in review mode
 * @param {Function} [props.updatePage] - Function to update the page in review mode
 * @returns {JSX.Element} Service branch form page
 */
export const ServiceBranchPage = ({
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

  return (
    <PageTemplate
      title="Service periods"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={handleBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={serviceBranchPageSchema}
      sectionName="tempServicePeriod"
      navigationProps={{
        backButtonText: shouldShowCancelEdit ? 'Cancel' : 'Back',
      }}
      defaultData={{
        branchOfService: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <SelectField
          name="branchOfService"
          label="Branch of service"
          value={localData.branchOfService || ''}
          onChange={handleFieldChange}
          required
          error={errors.branchOfService}
          forceShowError={formSubmitted}
          schema={branchOfServiceSchema}
          options={constants.branchesServed}
        />
      )}
    </PageTemplate>
  );
};

ServiceBranchPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
