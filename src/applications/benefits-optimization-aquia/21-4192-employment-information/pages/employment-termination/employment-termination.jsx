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

  return (
    <PageTemplate
      title="Employment information"
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
          <h3 className="vads-u-margin-top--0">Termination of employment</h3>

          <TextareaField
            name="terminationReason"
            label="If Veteran is not working, state the reason for termination of employment: (if retired on disability, please specify)"
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
          />
        </>
      )}
    </PageTemplate>
  );
};

EmploymentTerminationPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};

export default EmploymentTerminationPage;
