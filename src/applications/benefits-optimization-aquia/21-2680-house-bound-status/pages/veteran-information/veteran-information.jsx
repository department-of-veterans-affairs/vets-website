import PropTypes from 'prop-types';
import React from 'react';

import {
  MemorableDateField,
  SSNField,
} from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

import {
  veteranDOBSchema,
  veteranIdentificationPageSchema,
  veteranSSNSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['veteranDOB']);
};

/**
 * Veteran Information Page
 * Section I - Items 1-5: Veteran identification information
 * @module pages/veteran-information
 */
export const VeteranInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Migrate old field names to new field names for backward compatibility
  // This handles save-in-progress data that used old camelCase field names
  const existingData = formDataToUse?.veteranIdentification || {};
  const migratedData = {
    ...formDataToUse,
    veteranIdentification: {
      ...(existingData.veteranFullName && {
        veteranFullName: existingData.veteranFullName,
      }),
      veteranSSN: existingData.veteranSSN || existingData.veteranSsn || '',
      veteranDOB: existingData.veteranDOB || existingData.veteranDob || '',
    },
  };

  return (
    <PageTemplateWithSaveInProgress
      data={migratedData}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranIdentificationPageSchema}
      sectionName="veteranIdentification"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{
        veteranFullName: {
          first: '',
          middle: '',
          last: '',
        },
        veteranSSN: '',
        veteranDOB: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <h2 className="vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--h4 vads-u-line-height--1">
            Confirm the personal information we have on file for the Veteran.
          </h2>

          <FullnameField
            fieldPrefix="veteran"
            value={localData.veteranFullName}
            onChange={handleFieldChange}
            errors={errors.veteranFullName || {}}
            forceShowError={formSubmitted}
            required
            showSuffix={false}
          />

          <SSNField
            label="Social Security number"
            name="veteranSSN"
            value={localData.veteranSSN || ''}
            onChange={handleFieldChange}
            error={errors.veteranSSN}
            forceShowError={formSubmitted}
            required
            schema={veteranSSNSchema}
          />

          <MemorableDateField
            label="Date of birth"
            name="veteranDOB"
            value={localData.veteranDOB || ''}
            onChange={handleFieldChange}
            error={errors.veteranDOB}
            forceShowError={formSubmitted}
            required
            schema={veteranDOBSchema}
          />
        </>
      )}
    </PageTemplateWithSaveInProgress>
  );
};

VeteranInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
