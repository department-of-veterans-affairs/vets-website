import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import { PreviousNameSummaryCard } from '../../components/previous-name-summary-card';

/**
 * Schema for previous names summary page
 * This schema is optional because validation is handled conditionally
 * based on whether previous names exist.
 */
const previousNamesSummarySchema = z.object({
  hasAdditionalPreviousNames: z
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
 * Veteran Previous Names Summary page component for the interment allowance form.
 * Displays a list of previously entered names with options to add, edit, or delete.
 * This is the second page in the previous names flow.
 * This page is conditionally shown if the user answered "yes" to serving under a different name.
 * This is part of the "Military history" chapter.
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
 * @returns {JSX.Element} Previous names summary page
 */
export const VeteranPreviousNamesPage = ({
  data,
  setFormData,
  goForward,
  goToPath,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  const previousNames = formDataToUse.previousNames || [];

  const handleEdit = index => {
    // Copy the name to edit into tempPreviousName with nested fullName structure
    const nameToEdit = previousNames[index];
    const updatedData = {
      ...formDataToUse,
      tempPreviousName: { fullName: nameToEdit, isEditing: true },
      editingPreviousNameIndex: index,
    };
    setFormData(updatedData);

    // Navigate to entry page
    if (goToPath) {
      goToPath('/previous-name-entry');
    }
  };

  const handleDelete = index => {
    const updatedNames = previousNames.filter((_, i) => i !== index);
    const updatedData = {
      ...formDataToUse,
      previousNames: updatedNames,
    };
    setFormData(updatedData);
  };

  const handleAddAnother = () => {
    // Clear temp object and editing index, set isEditing flag with nested fullName
    const updatedData = {
      ...formDataToUse,
      tempPreviousName: {
        fullName: {
          first: '',
          middle: '',
          last: '',
        },
        isEditing: true,
      },
      editingPreviousNameIndex: undefined,
    };
    setFormData(updatedData);

    // Navigate to entry page
    if (goToPath) {
      // timeout is needed to prevent a race condition between setFormData and
      //  page navigation otherwise the formData doesn't reflect the change in time for the depends
      setTimeout(() => {
        goToPath('/previous-name-entry');
      }, 0);
    }
  };

  // Custom validation - require at least one previous name OR add one
  const validatePreviousNames = () => {
    if (previousNames.length === 0) {
      return {
        valid: false,
        errors: {
          previousNamesData: {
            _error: 'Please add at least one previous name',
          },
        },
      };
    }
    return { valid: true };
  };

  // Custom forward handler - if user says yes to additional names, go back to previous-name-entry
  const handleForward = () => {
    const hasAdditionalNames =
      formDataToUse.previousNamesData?.hasAdditionalPreviousNames;

    if (hasAdditionalNames === 'yes') {
      handleAddAnother();
    } else {
      goForward(formDataToUse);
    }
  };

  // Custom back handler - jumping back to served-under-different-name
  //  editing pages happens in first entry and on "edit"
  const handleBack = () => {
    const updatedData = {
      ...formDataToUse,
      tempPreviousName: {
        fullName: {
          first: '',
          middle: '',
          last: '',
          suffix: '',
        },
        isEditing: false,
      },
      editingPreviousNameIndex: undefined,
    };
    setFormData(updatedData);
    goToPath('/served-under-different-name');
  };

  return (
    <PageTemplate
      title="Review the names the Veteran served under"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={handleForward}
      goBack={handleBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={previousNamesSummarySchema}
      sectionName="previousNamesData"
      customValidation={validatePreviousNames}
      defaultData={{
        hasAdditionalPreviousNames: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          {previousNames.length === 0 ? (
            <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-y--3">
              <p className="vads-u-margin--0">No previous names added yet.</p>
            </div>
          ) : (
            <div className="vads-u-margin-y--3">
              {previousNames.map((name, index) => (
                <PreviousNameSummaryCard
                  key={index}
                  previousName={name}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <RadioField
            name="hasAdditionalPreviousNames"
            label="Do you have another name the Veteran served under?"
            value={localData.hasAdditionalPreviousNames || ''}
            onChange={handleFieldChange}
            required
            error={errors.hasAdditionalPreviousNames}
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

VeteranPreviousNamesPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
