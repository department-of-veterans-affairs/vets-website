import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import { ServicePeriodSummaryCard } from '../../components/service-period-summary-card';

/**
 * Schema for service periods summary page
 * This schema is optional because validation is handled conditionally
 * based on whether service periods exist.
 */
const servicePeriodsSummarySchema = z.object({
  hasAdditionalServicePeriods: z
    .enum(['yes', 'no'], {
      errorMap: (issue, ctx) => {
        if (
          issue.code === 'invalid_enum_value' ||
          issue.code === 'invalid_type'
        ) {
          return {
            message: 'Please select yes or no',
          };
        }
        return { message: ctx.defaultError };
      },
    })
    .optional(),
});

/**
 * Service Periods Summary page component for the interment allowance form.
 * Displays a list of previously entered service periods with options to add, edit, or delete.
 * This is the fourth and final page in the service period flow.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @param {Function} [props.goToPath] - Function to navigate to a specific path
 * @param {boolean} [props.onReviewPage] - Whether the page is being displayed in review mode
 * @param {Function} [props.updatePage] - Function to update the page in review mode
 * @returns {JSX.Element} Service periods summary page
 */
export const ServicePeriodsPage = ({
  data,
  setFormData,
  goForward,
  // goBack,
  goToPath,
  onReviewPage,
  updatePage,
}) => {
  // const dispatch = useDispatch();
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  const servicePeriods = formDataToUse.servicePeriods || [];

  const handleEdit = index => {
    // Copy the service period to edit into tempServicePeriod
    const periodToEdit = servicePeriods[index];
    const updatedData = {
      ...formDataToUse,
      tempServicePeriod: { ...periodToEdit, isEditing: true },
      editingServicePeriodIndex: index,
    };
    setFormData(updatedData);

    // Navigate to first page of the flow
    if (goToPath) {
      goToPath('/service-branch');
    }
  };

  const handleDelete = index => {
    const updatedPeriods = servicePeriods.filter((_, i) => i !== index);
    const updatedData = {
      ...formDataToUse,
      servicePeriods: updatedPeriods,
    };
    setFormData(updatedData);
  };

  const handleAddAnother = () => {
    // Clear temp object and editing index, set isEditing flag
    const updatedData = {
      ...formDataToUse,
      tempServicePeriod: {
        branchOfService: '',
        dateFrom: '',
        dateTo: '',
        placeOfEntry: '',
        placeOfSeparation: '',
        rank: '',
        isEditing: true,
      },
      editingServicePeriodIndex: undefined,
    };
    setFormData(updatedData);

    // Navigate to first page of the flow
    if (goToPath) {
      // timeout is needed to prevent a race condition between setFormData and
      //  page navigation otherwise the formData doesn't reflect the change in time for the depends
      setTimeout(() => {
        goToPath('/service-branch');
      }, 0);
    }
  };

  // Custom validation - require at least one service period OR add one
  const validateServicePeriods = () => {
    if (servicePeriods.length === 0) {
      return {
        valid: false,
        errors: {
          servicePeriodsData: {
            _error: 'Please add at least one service period',
          },
        },
      };
    }
    return { valid: true };
  };

  // Custom forward handler - if user says yes to additional periods, go back to service-branch
  const handleForward = () => {
    const hasAdditionalPeriods =
      formDataToUse.servicePeriodsData?.hasAdditionalServicePeriods;

    if (hasAdditionalPeriods === 'yes') {
      handleAddAnother();
    } else {
      goForward(formDataToUse);
    }
  };

  // Custom back handler - jumping back to burial information
  //  editing pages happens in first entry and on "edit"
  const handleBack = () => {
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
    goToPath('/burial-information');
  };

  return (
    <PageTemplate
      title="Review the Veteran's service periods"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={handleForward}
      goBack={handleBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={servicePeriodsSummarySchema}
      sectionName="servicePeriodsData"
      customValidation={validateServicePeriods}
      defaultData={{
        hasAdditionalServicePeriods: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          {servicePeriods.length === 0 ? (
            <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-y--3">
              <p className="vads-u-margin--0">No service periods added yet.</p>
            </div>
          ) : (
            <div className="vads-u-margin-y--3">
              {servicePeriods.map((period, index) => (
                <ServicePeriodSummaryCard
                  key={index}
                  servicePeriod={period}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <RadioField
            name="hasAdditionalServicePeriods"
            label="Do you have another service period to add?"
            value={localData.hasAdditionalServicePeriods || ''}
            onChange={handleFieldChange}
            required
            error={errors.hasAdditionalServicePeriods}
            forceShowError={formSubmitted}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
          />
        </>
      )}
    </PageTemplate>
  );
};

ServicePeriodsPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
