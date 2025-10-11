import PropTypes from 'prop-types';
import React from 'react';

import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { ArrayField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import {
  formatPreviousNameSummary,
  isPreviousNameEmpty,
  previousNameItemSchema,
  previousNamesSchema,
} from '../../schemas';

/**
 * Schema for veteran previous names page
 */
const veteranPreviousNamesPageSchema = z.object({
  previousNames: previousNamesSchema,
});

/**
 * Veteran Previous Names page component for the interment allowance form.
 * Collects all previous names the veteran served under during their military service.
 * This page is conditionally shown if the user answered "yes" to serving under a different name.
 * This is part of the "Military history" chapter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Veteran previous names form page
 *
 * @example
 * ```jsx
 * <VeteranPreviousNamesPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const VeteranPreviousNamesPage = ({
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
      title="Previous names"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={veteranPreviousNamesPageSchema}
      sectionName="veteranPreviousNames"
      defaultData={{
        previousNames: [
          {
            firstName: '',
            middleName: '',
            lastName: '',
          },
        ],
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please list all names the Veteran served under during their military
            service.
          </p>

          <ArrayField
            name="previousNames"
            label="Previous names"
            value={localData.previousNames}
            onChange={handleFieldChange}
            defaultItem={{
              firstName: '',
              middleName: '',
              lastName: '',
            }}
            itemName="previous name"
            addButtonText="Add another previous name"
            getItemSummary={formatPreviousNameSummary}
            isItemEmpty={isPreviousNameEmpty}
            errors={errors.previousNames}
            required
            renderItem={(item, index, handleItemChange, itemErrors) => (
              <>
                <TextInputField
                  name="firstName"
                  label="First name"
                  value={item.firstName}
                  onChange={(name, value) =>
                    handleItemChange(index, name, value)
                  }
                  error={itemErrors?.firstName}
                  forceShowError={formSubmitted}
                  schema={previousNameItemSchema.shape.firstName}
                  required
                />

                <TextInputField
                  name="middleName"
                  label="Middle name"
                  value={item.middleName}
                  onChange={(name, value) =>
                    handleItemChange(index, name, value)
                  }
                  error={itemErrors?.middleName}
                  forceShowError={formSubmitted}
                  schema={previousNameItemSchema.shape.middleName}
                />

                <TextInputField
                  name="lastName"
                  label="Last name"
                  value={item.lastName}
                  onChange={(name, value) =>
                    handleItemChange(index, name, value)
                  }
                  error={itemErrors?.lastName}
                  forceShowError={formSubmitted}
                  schema={previousNameItemSchema.shape.lastName}
                  required
                />
              </>
            )}
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
  onReviewPage: PropTypes.bool,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
