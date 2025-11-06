import PropTypes from 'prop-types';
import React from 'react';

import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import { fullNameSchema } from '../../schemas';

/**
 * Schema for previous name entry page
 * Uses the fullName structure matching the established pattern
 */
const previousNameEntryPageSchema = z.object({
  fullName: fullNameSchema,
});

/**
 * Previous Name Entry page component for the interment allowance form.
 * First page in the previous names flow - collects a single previous name.
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
 * @returns {JSX.Element} Previous name entry form page
 */
export const PreviousNameEntryPage = ({
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

  // Check if we're editing an existing name or adding another
  const hasExistingNames = (formDataToUse.previousNames || []).length > 0;
  const isEditingExisting =
    typeof formDataToUse.editingPreviousNameIndex === 'number';
  const isAddingAnother = hasExistingNames && !isEditingExisting;
  const shouldShowCancelEdit = isEditingExisting || isAddingAnother;

  // Custom back handler for cancel edit
  const handleBack = () => {
    if (shouldShowCancelEdit) {
      // Cancel edit/add - clear temp data and return to summary
      const updatedData = {
        ...formDataToUse,
        tempPreviousName: {
          fullName: {
            first: '',
            middle: '',
            last: '',
          },
          isEditing: false,
        },
        editingPreviousNameIndex: undefined,
      };
      setFormData(updatedData);
      goToPath('/review-previous-names');
    } else {
      // Normal back navigation (first time through)
      goBack();
    }
  };

  // Custom forward handler to save the name
  const handleForward = () => {
    const currentNames = formDataToUse.previousNames || [];
    const tempName = formDataToUse.tempPreviousName || {};

    // Extract fullName and remove isEditing flag before saving
    const { fullName } = tempName;
    const nameToSave = fullName || {};

    let updatedNames;
    if (typeof formDataToUse.editingPreviousNameIndex === 'number') {
      // Update existing name
      updatedNames = currentNames.map(
        (name, idx) =>
          idx === formDataToUse.editingPreviousNameIndex ? nameToSave : name,
      );
    } else {
      // Add new name
      updatedNames = [...currentNames, nameToSave];
    }

    const updatedData = {
      ...formDataToUse,
      previousNames: updatedNames,
      tempPreviousName: {
        fullName: {
          first: '',
          middle: '',
          last: '',
        },
        isEditing: false,
      },
      editingPreviousNameIndex: undefined,
    };
    setFormData(updatedData);

    // Navigate to summary page if we have existing names, otherwise continue normally
    if (hasExistingNames || isAddingAnother) {
      goToPath('/review-previous-names');
    } else {
      goForward(updatedData);
    }
  };

  return (
    <PageTemplate
      title="Name the Veteran served under"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={handleForward}
      goBack={handleBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={previousNameEntryPageSchema}
      sectionName="tempPreviousName"
      navigationProps={{
        backButtonText: shouldShowCancelEdit ? 'Cancel' : 'Back',
      }}
      defaultData={{
        fullName: {
          first: '',
          middle: '',
          last: '',
          suffix: '',
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <FullnameField
          name="fullName"
          value={localData.fullName}
          onChange={handleFieldChange}
          errors={errors.fullName}
          forceShowError={formSubmitted}
          label=""
          legend=""
          showSuffix
          required
        />
      )}
    </PageTemplate>
  );
};

PreviousNameEntryPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
