import PropTypes from 'prop-types';
import React from 'react';

import {
  MemorableDateField,
  TextareaField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  dateLastWorkedSchema,
  employmentTerminationSchema,
  terminationReasonSchema,
} from '../../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateLastWorked']);
};

/**
 * Employment Termination page component
 * This page collects information about employment termination
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @param {Function} props.goBack - Function to go to previous page
 * @returns {JSX.Element} Employment termination form page
 */
export const EmploymentTerminationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Get veteran name
  const veteranInfo = formDataToUse?.veteranInformation || {};
  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  // Get ending date from employment dates
  const endingDate = formDataToUse?.employmentDates?.endingDate || '';
  const formatDate = dateString => {
    if (!dateString) return null;
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formattedEndDate = formatDate(endingDate);

  return (
    <PageTemplate
      title="Termination of employment"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={employmentTerminationSchema}
      sectionName="employmentTermination"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        terminationReason: '',
        dateLastWorked: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <div className="vads-u-margin-top--neg2">
            {formattedEndDate ? (
              <p>
                On a previous page, you indicated that {veteranName} stopped
                working on {formattedEndDate}. Why did they stop working?
              </p>
            ) : (
              <p>
                On a previous page, you indicated that {veteranName} stopped
                working. Why did they stop working?
              </p>
            )}

            <TextareaField
              name="terminationReason"
              label="Reason for termination of employment"
              hint="If they retired on disability, please specify."
              schema={terminationReasonSchema}
              value={localData.terminationReason}
              onChange={handleFieldChange}
              error={errors.terminationReason}
              forceShowError={formSubmitted}
              rows={5}
              maxLength={1000}
            />

            <MemorableDateField
              name="dateLastWorked"
              label="Date last worked"
              schema={dateLastWorkedSchema}
              value={localData.dateLastWorked}
              onChange={handleFieldChange}
              error={errors.dateLastWorked}
              forceShowError={formSubmitted}
              required
            />
          </div>
        </>
      )}
    </PageTemplate>
  );
};

EmploymentTerminationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default EmploymentTerminationPage;
